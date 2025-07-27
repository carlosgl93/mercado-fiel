import { NextFunction, Request, Response } from 'express';

// Centralized error handler middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
