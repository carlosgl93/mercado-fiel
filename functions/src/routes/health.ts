import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
export const statusRouter = Router();
// Status endpoint with validation and logging
statusRouter.get('/status', async (req, res, next) => {
  try {
    // Environment detection
    const isDev =
      process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR === 'true';
    console.log({ isDev });
    // Log request
    console.log(`[${new Date().toISOString()}] GET /status`);

    const result = await prisma.$queryRaw`SELECT 1 as status`;

    // Consistent response format
    res.json({
      success: true,
      env: isDev ? 'dev' : 'prod',
      dbStatus: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Pass error to centralized handler
    next(error);
  }
});
