import { NextFunction, Request, Response } from 'express';
import { logger } from 'firebase-functions';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.info(`Request: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString(),
  });
  next();
}
