import { Request, Response, NextFunction } from 'express';
import { jwtManager } from '@/utils/jwt';
import { createError } from '@/middleware/errorHandler';
import { ApiTokenService } from '@/services/apiTokenService';
import { UserRole } from '@/types';

// Extend Express Request type
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Middleware to authenticate JWT token or API token
 */
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try to get token from Authorization header
    let token = jwtManager.extractTokenFromHeader(req.headers.authorization);
    
    // If not in header, try to get from cookies
    if (!token && req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      throw createError.unauthorized('Access token required');
    }

    // Check if it's an API token (starts with 'nst_')
    if (token.startsWith('nst_')) {
      const apiTokenPayload = await ApiTokenService.validateApiToken(token);
      
      if (!apiTokenPayload) {
        throw createError.unauthorized('Invalid or expired API token');
      }

      // Add user info to request
      req.user = {
        userId: apiTokenPayload.userId,
        email: apiTokenPayload.email,
        role: apiTokenPayload.role as UserRole,
      };
    } else {
      // Verify JWT token
      const payload = jwtManager.verifyAccessToken(token);
      
      // Add user info to request
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize based on user roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError.unauthorized('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw createError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware for optional authentication (doesn't fail if no token)
 */
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    let token = jwtManager.extractTokenFromHeader(req.headers.authorization);
    
    if (!token && req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (token) {
      try {
        const payload = jwtManager.verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };
      } catch (error) {
        // Token is invalid, but we don't throw an error
        // Just continue without user info
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user owns resource or has admin privileges
 */
export const ownerOrAdmin = (getUserIdFromRequest: (req: AuthenticatedRequest) => string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw createError.unauthorized('Authentication required');
      }

      const resourceUserId = getUserIdFromRequest(req);
      
      // Allow if user is admin or owns the resource
      if (req.user.role === 'admin' || req.user.userId === resourceUserId) {
        next();
      } else {
        throw createError.forbidden('Access denied');
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limiting for authentication endpoints
 */
export const authRateLimit = (maxAttempts: number = 5, windowMinutes: number = 15) => {
  const attempts: Map<string, { count: number; resetTime: number }> = new Map();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const userAttempts = attempts.get(key);

    if (!userAttempts || now > userAttempts.resetTime) {
      // First attempt or window expired
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      next();
    } else if (userAttempts.count >= maxAttempts) {
      // Too many attempts
      throw createError.tooManyRequests(
        `Too many authentication attempts. Try again in ${Math.ceil((userAttempts.resetTime - now) / 60000)} minutes.`
      );
    } else {
      // Increment attempt count
      userAttempts.count++;
      next();
    }
  };
};