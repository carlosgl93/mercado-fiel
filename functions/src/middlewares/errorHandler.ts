import { NextFunction, Request, Response } from 'express';

// Centralized error handler middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
