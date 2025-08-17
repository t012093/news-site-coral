import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { ApiTokenService } from '@/services/apiTokenService';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { LoginData, RegisterData, CreateApiTokenRequest } from '@/types';

export class AuthController {
  /**
   * POST /api/auth/login
   * Login user
   */
  public static login = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginData = req.body;

    // Validate required fields
    if (!loginData.email || !loginData.password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate email format
    if (!AuthService.isValidEmail(loginData.email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email format' },
        timestamp: new Date().toISOString(),
      });
    }

    const authResponse = await AuthService.login(loginData);

    // Set HTTP-only cookies for security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: loginData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    };

    res.cookie('auth_token', authResponse.token, cookieOptions);
    res.cookie('refresh_token', authResponse.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token
    });

    res.status(200).json({
      success: true,
      data: {
        user: authResponse.user,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/auth/register
   * Register new user
   */
  public static register = asyncHandler(async (req: Request, res: Response) => {
    const registerData: RegisterData = req.body;

    // Validate required fields
    const requiredFields = ['email', 'username', 'displayName', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !registerData[field as keyof RegisterData]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: { 
          message: `Missing required fields: ${missingFields.join(', ')}`,
          details: { missingFields }
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate email format
    if (!AuthService.isValidEmail(registerData.email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email format' },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate username format
    if (!AuthService.isValidUsername(registerData.username)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Username must be 3-30 characters long and contain only letters, numbers, and underscores' },
        timestamp: new Date().toISOString(),
      });
    }

    const authResponse = await AuthService.register(registerData);

    // Set HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    res.cookie('auth_token', authResponse.token, cookieOptions);
    res.cookie('refresh_token', authResponse.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token
    });

    res.status(201).json({
      success: true,
      data: {
        user: authResponse.user,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  public static refresh = asyncHandler(async (req: Request, res: Response) => {
    let refreshToken = req.body.refreshToken;

    // Try to get refresh token from cookie if not in body
    if (!refreshToken && req.cookies && req.cookies.refresh_token) {
      refreshToken = req.cookies.refresh_token;
    }

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: { message: 'Refresh token is required' },
        timestamp: new Date().toISOString(),
      });
    }

    const tokens = await AuthService.refreshToken(refreshToken);

    // Update cookies with new tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    res.cookie('auth_token', tokens.token, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token
    });

    res.status(200).json({
      success: true,
      data: tokens,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/auth/logout
   * Logout user
   */
  public static logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (req.user) {
      const refreshToken = req.cookies?.refresh_token || req.body.refreshToken;
      await AuthService.logout(req.user.userId, refreshToken);
    }

    // Clear cookies
    res.clearCookie('auth_token');
    res.clearCookie('refresh_token');

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/auth/me
   * Get current user info
   */
  public static getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
        timestamp: new Date().toISOString(),
      });
    }

    const user = await AuthService.getCurrentUser(req.user.userId);

    res.status(200).json({
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/auth/validate
   * Validate current token
   */
  public static validateToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid or expired token' },
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({
      success: true,
      data: { 
        valid: true,
        user: {
          userId: req.user.userId,
          email: req.user.email,
          role: req.user.role,
        }
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/auth/forgot-password
   * Request password reset (placeholder)
   */
  public static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email || !AuthService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid email is required' },
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: Implement password reset functionality
    // For now, just return success to prevent email enumeration
    res.status(200).json({
      success: true,
      data: { message: 'If the email exists, a password reset link has been sent.' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/auth/reset-password
   * Reset password (placeholder)
   */
  public static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token and new password are required' },
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: Implement password reset functionality
    res.status(501).json({
      success: false,
      error: { message: 'Password reset not yet implemented' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/auth/api-tokens
   * Create a new API token
   */
  public static createApiToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
        timestamp: new Date().toISOString(),
      });
    }

    const tokenData: CreateApiTokenRequest = req.body;

    // Validate required fields
    if (!tokenData.name || tokenData.name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token name is required' },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate token name length
    if (tokenData.name.length > 100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token name must be 100 characters or less' },
        timestamp: new Date().toISOString(),
      });
    }

    const result = await ApiTokenService.createApiToken(req.user.userId, tokenData);

    res.status(201).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/auth/api-tokens
   * Get user's API tokens
   */
  public static getApiTokens = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
        timestamp: new Date().toISOString(),
      });
    }

    const tokens = await ApiTokenService.getUserApiTokens(req.user.userId);

    res.status(200).json({
      success: true,
      data: { tokens },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * DELETE /api/auth/api-tokens/:tokenId
   * Revoke an API token
   */
  public static revokeApiToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { tokenId } = req.params;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token ID is required' },
        timestamp: new Date().toISOString(),
      });
    }

    await ApiTokenService.revokeApiToken(req.user.userId, tokenId);

    res.status(200).json({
      success: true,
      data: { message: 'API token revoked successfully' },
      timestamp: new Date().toISOString(),
    });
  });
}