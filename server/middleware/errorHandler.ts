import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  code: string | undefined;
  details?: unknown;
}

export const createApiError = (
  message: string,
  statusCode = 500,
  code?: string,
  details?: unknown
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = (err as ApiError).statusCode || 500;
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      code: (err as ApiError).code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        details: (err as ApiError).details || err.stack,
      }),
    },
  };

  logger.error(err.stack || err.message, {
    error: err,
    route: req.path,
    method: req.method,
    statusCode,
  });

  res.status(statusCode).json(errorResponse);
};