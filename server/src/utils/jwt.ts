import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '@/types';
import { createError } from '@/middleware/errorHandler';

export class JWTManager {
  private static instance: JWTManager;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  private constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-key';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

    if (this.jwtSecret === 'default-jwt-secret-key' || this.jwtRefreshSecret === 'default-refresh-secret-key') {
      console.warn('⚠️  Using default JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET in production!');
    }
  }

  public static getInstance(): JWTManager {
    if (!JWTManager.instance) {
      JWTManager.instance = new JWTManager();
    }
    return JWTManager.instance;
  }

  /**
   * Generate access token
   */
  public generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    try {
      return jwt.sign(payload as object, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
        issuer: 'coral-backend',
        audience: 'coral-frontend',
      } as any);
    } catch (error) {
      throw createError.internalError('Failed to generate access token');
    }
  }

  /**
   * Generate refresh token
   */
  public generateRefreshToken(userId: string): string {
    try {
      return jwt.sign(
        { userId, type: 'refresh' } as object,
        this.jwtRefreshSecret,
        {
          expiresIn: this.jwtRefreshExpiresIn,
          issuer: 'coral-backend',
          audience: 'coral-frontend',
        } as any
      );
    } catch (error) {
      throw createError.internalError('Failed to generate refresh token');
    }
  }

  /**
   * Verify access token
   */
  public verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'coral-backend',
        audience: 'coral-frontend',
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createError.unauthorized('Access token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw createError.unauthorized('Invalid access token');
      } else {
        throw createError.unauthorized('Access token verification failed');
      }
    }
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): { userId: string; type: string } {
    try {
      const decoded = jwt.verify(token, this.jwtRefreshSecret, {
        issuer: 'coral-backend',
        audience: 'coral-frontend',
      }) as any;

      if (decoded.type !== 'refresh') {
        throw createError.unauthorized('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createError.unauthorized('Refresh token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw createError.unauthorized('Invalid refresh token');
      } else {
        throw createError.unauthorized('Refresh token verification failed');
      }
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  public generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload.userId),
    };
  }

  /**
   * Extract token from Authorization header
   */
  public extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Get token expiry time
   */
  public getTokenExpiry(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const jwtManager = JWTManager.getInstance();