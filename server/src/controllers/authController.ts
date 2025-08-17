import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { ApiTokenService } from '@/services/apiTokenService';
import { EmailVerificationServiceFactory } from '@/services/emailVerificationServiceFactory';
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

  /**
   * POST /api/auth/send-verification-code
   * Send 6-digit verification code to email
   */
  public static sendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
    const { email, purpose = 'login' } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email address is required' },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate email format
    if (!AuthService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email format' },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate purpose
    if (!['login', 'register', 'password_reset'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid purpose' },
        timestamp: new Date().toISOString(),
      });
    }

    const EmailVerificationService = await EmailVerificationServiceFactory.getService();
    const result = await EmailVerificationService.sendVerificationCode(
      email,
      purpose,
      req.ip,
      req.get('User-Agent')
    );

    res.status(200).json({
      success: true,
      data: {
        message: 'Verification code sent successfully',
        expiresIn: result.expiresIn,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/auth/debug-codes
   * Debug endpoint to see verification codes (development only)
   */
  public static getDebugCodes = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        error: { message: 'Not found' },
        timestamp: new Date().toISOString(),
      });
    }

    const { email, purpose = 'register' } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email parameter required' },
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const EmailVerificationService = await EmailVerificationServiceFactory.getService();
      const codes = await EmailVerificationService.getVerificationStatus(email as string, purpose as string);
      
      res.status(200).json({
        success: true,
        data: { codes },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to get verification codes' },
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * POST /api/auth/test-email
   * Test email sending (development only)
   */
  public static testEmail = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        error: { message: 'Not found' },
        timestamp: new Date().toISOString(),
      });
    }

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email address required' },
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const { emailService } = require('@/services/emailService');
      
      // Test connection first
      const connectionOk = await emailService.testConnection();
      if (!connectionOk) {
        return res.status(500).json({
          success: false,
          error: { message: 'Email service connection failed' },
          timestamp: new Date().toISOString(),
        });
      }

      // Send test email
      const emailSent = await emailService.sendTestEmail(email);
      if (!emailSent) {
        return res.status(500).json({
          success: false,
          error: { message: 'Test email sending failed' },
          timestamp: new Date().toISOString(),
        });
      }

      res.status(200).json({
        success: true,
        data: { message: 'Test email sent successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: 'Test email failed' },
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * POST /api/auth/verify-code
   * Verify 6-digit code and authenticate user
   */
  public static verifyEmailCode = asyncHandler(async (req: Request, res: Response) => {
    const { email, code, purpose = 'login' } = req.body;

    // Validate required fields
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and verification code are required' },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Verification code must be 6 digits' },
        timestamp: new Date().toISOString(),
      });
    }

    // Verify the code
    const EmailVerificationService = await EmailVerificationServiceFactory.getService();
    const verification = await EmailVerificationService.verifyCode(email, code, purpose);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid verification code' },
        timestamp: new Date().toISOString(),
      });
    }

    // For login purpose, authenticate the user
    if (purpose === 'login') {
      // Create login data for email-based authentication
      const loginData: LoginData = {
        email,
        password: '', // Password not needed for email auth
        rememberMe: true,
      };

      // Use email authentication instead of password
      const authResponse = await AuthService.loginWithEmail(email);

      // Set HTTP-only cookies for security
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      };

      res.cookie('auth_token', authResponse.token, cookieOptions);
      res.cookie('refresh_token', authResponse.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token
      });

      return res.status(200).json({
        success: true,
        data: {
          user: authResponse.user,
          token: authResponse.token,
          refreshToken: authResponse.refreshToken,
          message: 'Email authentication successful',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // For other purposes (register, password_reset), just confirm verification
    res.status(200).json({
      success: true,
      data: {
        message: 'Verification code confirmed',
        verificationId: verification.verificationId,
      },
      timestamp: new Date().toISOString(),
    });
  });
}