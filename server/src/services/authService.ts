import { LoginData, RegisterData, AuthResponse, User } from '@/types';
import { MockUserService } from '@/services/mockUserService';
import { jwtManager } from '@/utils/jwt';
import { createError } from '@/middleware/errorHandler';
import { redisClient } from '@/config/database';

export class AuthService {
  /**
   * Login user
   */
  public static async login(loginData: LoginData): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Verify password
    const verification = await MockUserService.verifyPassword(email, password);
    
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
    await MockUserService.updateOnlineStatus(user.id, true);

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
    const user = await MockUserService.createUser(registerData);

    // Generate JWT tokens
    const { accessToken, refreshToken } = jwtManager.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in Redis
    await this.storeRefreshToken(user.id, refreshToken);

    // Update user online status
    await MockUserService.updateOnlineStatus(user.id, true);

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
      const user = await MockUserService.findById(decoded.userId);
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
    await MockUserService.updateOnlineStatus(userId, false);

    // Remove refresh token from Redis
    if (refreshToken) {
      await this.removeRefreshToken(userId);
    }
  }

  /**
   * Get current user
   */
  public static async getCurrentUser(userId: string): Promise<User> {
    const user = await MockUserService.findById(userId);
    
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
      const user = await MockUserService.findById(userId);
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
    await MockUserService.updateOnlineStatus(userId, isOnline);
  }
}