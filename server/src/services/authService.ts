import { LoginData, RegisterData, AuthResponse, User } from '@/types';
import { UserService } from '@/services/userService';
import { jwtManager } from '@/utils/jwt';
import { createError } from '@/middleware/errorHandler';
import { redisClient } from '@/config/database';

export class AuthService {
  /**
   * Login user with password
   */
  public static async login(loginData: LoginData): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Verify password
    const verification = await UserService.verifyPassword(email, password);
    
    if (!verification.isValid || !verification.user) {
      throw createError.unauthorized('Invalid email or password');
    }

    const user = verification.user;

    // Check if user is active
    if (!user.isActive) {
      throw createError.unauthorized('Account is deactivated');
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = jwtManager.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in Redis with expiration
    await this.storeRefreshToken(user.id, refreshToken);

    // Update user online status
    await UserService.updateOnlineStatus(user.id, true);

    return {
      user,
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Login user with email only (for email verification authentication)
   */
  public static async loginWithEmail(email: string): Promise<AuthResponse> {
    // Get user by email
    const user = await UserService.findByEmail(email);
    
    if (!user) {
      throw createError.unauthorized('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError.unauthorized('Account is deactivated');
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = jwtManager.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in Redis with expiration
    await this.storeRefreshToken(user.id, refreshToken);

    // Update user online status
    await UserService.updateOnlineStatus(user.id, true);

    return {
      user,
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Register new user
   */
  public static async register(registerData: RegisterData): Promise<AuthResponse> {
    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      throw createError.badRequest('Passwords do not match');
    }

    // Create user
    const user = await UserService.createUser(registerData);

    // Generate JWT tokens
    const { accessToken, refreshToken } = jwtManager.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in Redis
    await this.storeRefreshToken(user.id, refreshToken);

    // Update user online status
    await UserService.updateOnlineStatus(user.id, true);

    return {
      user,
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  public static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwtManager.verifyRefreshToken(refreshToken);

      // Check if refresh token exists in Redis
      const storedToken = await this.getStoredRefreshToken(decoded.userId);
      if (storedToken !== refreshToken) {
        throw createError.unauthorized('Invalid refresh token');
      }

      // Get user info
      const user = await UserService.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw createError.unauthorized('User not found or inactive');
      }

      // Generate new token pair
      const newTokens = jwtManager.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Store new refresh token and remove old one
      await this.storeRefreshToken(user.id, newTokens.refreshToken);

      return {
        token: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      };

    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error;
      }
      throw createError.unauthorized('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  public static async logout(userId: string, refreshToken?: string): Promise<void> {
    // Update user online status
    await UserService.updateOnlineStatus(userId, false);

    // Remove refresh token from Redis
    if (refreshToken) {
      await this.removeRefreshToken(userId);
    }
  }

  /**
   * Get current user
   */
  public static async getCurrentUser(userId: string): Promise<User> {
    const user = await UserService.findById(userId);
    
    if (!user) {
      throw createError.notFound('User not found');
    }

    if (!user.isActive) {
      throw createError.unauthorized('Account is deactivated');
    }

    return user;
  }

  /**
   * Store refresh token in Redis
   */
  private static async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    const expiry = 30 * 24 * 60 * 60; // 30 days in seconds
    
    try {
      await redisClient.setEx(key, expiry, refreshToken);
    } catch (error) {
      console.error('Failed to store refresh token in Redis:', error);
      // Continue without Redis - token will still work but won't be tracked
    }
  }

  /**
   * Get stored refresh token from Redis
   */
  private static async getStoredRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('Failed to get refresh token from Redis:', error);
      return null;
    }
  }

  /**
   * Remove refresh token from Redis
   */
  private static async removeRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Failed to remove refresh token from Redis:', error);
    }
  }

  /**
   * Validate email format
   */
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate username format
   */
  public static isValidUsername(username: string): boolean {
    // Username should be 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }

  /**
   * Check if user is online
   */
  public static async isUserOnline(userId: string): Promise<boolean> {
    const key = `user_online:${userId}`;
    
    try {
      const result = await redisClient.get(key);
      return result === 'true';
    } catch (error) {
      // Fallback to database if Redis is not available
      const user = await UserService.findById(userId);
      return user?.isActive || false;
    }
  }

  /**
   * Set user online status in Redis
   */
  public static async setUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const key = `user_online:${userId}`;

    try {
      if (isOnline) {
        await redisClient.setEx(key, 300, 'true'); // 5 minutes expiry
      } else {
        await redisClient.del(key);
      }
    } catch (error) {
      console.error('Failed to update online status in Redis:', error);
    }

    // Also update in database
    await UserService.updateOnlineStatus(userId, isOnline);
  }

  /**
   * Request password reset - send verification code to email
   */
  public static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // Check if user exists
    const user = await UserService.findByEmail(email);

    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return {
        success: true,
        message: 'If the email exists, a password reset code has been sent.',
      };
    }

    // Use existing email verification service to send password reset code
    const { EmailVerificationServiceFactory } = require('@/services/emailVerificationServiceFactory');
    const EmailVerificationService = await EmailVerificationServiceFactory.getService();

    try {
      await EmailVerificationService.sendVerificationCode(
        email,
        'password_reset',
        '127.0.0.1', // Default IP
        'Password Reset Request'
      );

      console.log(`Password reset code sent to: ${email}`);
      return {
        success: true,
        message: 'A password reset code has been sent to your email address.',
      };
    } catch (error) {
      console.error('Failed to send password reset code:', error);
      // Still return success to prevent leaking information
      return {
        success: true,
        message: 'If the email exists, a password reset code has been sent.',
      };
    }
  }

  /**
   * Reset password using verification code
   */
  public static async resetPassword(
    email: string,
    verificationCode: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    // Validate inputs
    if (!email || !verificationCode || !newPassword) {
      throw createError.badRequest('Email, verification code, and new password are required');
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      throw createError.badRequest('Invalid email format');
    }

    // Validate verification code format (6 digits)
    if (!/^\d{6}$/.test(verificationCode)) {
      throw createError.badRequest('Verification code must be 6 digits');
    }

    // Check if user exists
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw createError.notFound('User not found');
    }

    // Verify the reset code
    const { EmailVerificationServiceFactory } = require('@/services/emailVerificationServiceFactory');
    const EmailVerificationService = await EmailVerificationServiceFactory.getService();

    const verification = await EmailVerificationService.verifyCode(
      email,
      verificationCode,
      'password_reset'
    );

    if (!verification.valid) {
      throw createError.badRequest('Invalid or expired verification code');
    }

    // Update the password
    await UserService.updatePassword(email, newPassword);

    console.log(`Password successfully reset for user: ${email}`);
    return {
      success: true,
      message: 'Password has been successfully reset.',
    };
  }
}