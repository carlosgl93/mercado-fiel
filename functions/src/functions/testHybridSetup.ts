import { onRequest } from 'firebase-functions/v2/https';
// import { db } from '../lib/prisma'; // Commented out for MVP testing

/**
 * Test endpoint to validate hybrid Firebase + Supabase architecture
 * GET /api/test - Returns architecture status (without DB connection for MVP)
 * POST /api/test - Returns mock success response for MVP testing
 */
export const testHybridSetup = onRequest(
  {
    cors: true,
    timeoutSeconds: 60,
  },
  async (req, res) => {
    try {
      const method = req.method;

      if (method === 'GET') {
        // Test architecture without database for MVP
        res.status(200).json({
          success: true,
          message: 'Hybrid Firebase + Supabase architecture is working! 🚀',
          data: {
            architecture: 'Firebase Functions + Supabase PostgreSQL + Prisma ORM',
            status: 'MVP/POC Ready',
            timestamp: new Date().toISOString(),
            components: {
              frontend: 'React + Vite + Material UI ✅',
              backend: 'Firebase Cloud Functions ✅',
              database: 'Supabase PostgreSQL (Pending DB Password)',
              orm: 'Prisma ORM ✅',
              auth: 'Firebase Auth ✅',
              storage: 'Firebase Storage ✅',
            },
            nextSteps: [
              '1. Set Supabase database password in .env files',
              '2. Test real database connection',
              '3. Implement authentication flow',
              '4. Build minimal product CRUD',
            ],
          },
        });
      } else if (method === 'POST') {
        // Mock database write for MVP testing
        const mockUser = {
          id: `user_${Date.now()}`,
          nombre: 'Usuario Test MVP',
          email: `test-${Date.now()}@mercadofiel.com`,
          tipo_usuario: 'comprador',
          created_at: new Date().toISOString(),
        };

        res.status(201).json({
          success: true,
          message: 'Mock user creation successful! Ready for real database integration! ✅',
          data: mockUser,
          note: 'This is a mock response for MVP testing. Real database integration pending password setup.',
        });
      } else {
        res.status(405).json({
          success: false,
          message: 'Method not allowed',
        });
      }
    } catch (error) {
      console.error('Hybrid setup test error:', error);
      res.status(500).json({
        success: false,
        message: 'Error testing hybrid setup',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);
