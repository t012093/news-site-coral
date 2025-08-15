import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    statusCode = 500,
    message = 'Internal Server Error',
    stack
  } = err;

  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log error
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.path}`, {
    message,
    statusCode,
    stack: isDevelopment ? stack : undefined,
    userId: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isDevelopment && { stack }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Common error creators
export const createError = {
  badRequest: (message: string = 'Bad Request') => new CustomError(message, 400),
  unauthorized: (message: string = 'Unauthorized') => new CustomError(message, 401),
  forbidden: (message: string = 'Forbidden') => new CustomError(message, 403),
  notFound: (message: string = 'Not Found') => new CustomError(message, 404),
  conflict: (message: string = 'Conflict') => new CustomError(message, 409),
  unprocessableEntity: (message: string = 'Unprocessable Entity') => new CustomError(message, 422),
  tooManyRequests: (message: string = 'Too Many Requests') => new CustomError(message, 429),
  internalError: (message: string = 'Internal Server Error') => new CustomError(message, 500),
};