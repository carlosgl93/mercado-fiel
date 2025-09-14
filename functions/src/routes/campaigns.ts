// import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

// const prisma = new PrismaClient(); // TODO: Enable when campaign database tables are created
export const campaignsRouter = Router();

// For now, we'll return mock data since the campaign tables don't exist yet
// This structure shows what the final implementation should look like

// GET /api/campaigns/product/:productId - Get campaigns for a specific product
campaignsRouter.get('/product/:productId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const productIdNum = parseInt(productId, 10);

    if (isNaN(productIdNum)) {
      res.status(400).json({
        success: false,
        message: 'ID de producto inválido',
      });
      return;
    }

    // Mock campaigns data for now
    const mockCampaigns = [
      {
        id: 1,
        name: 'Compra Colectiva de Manzanas',
        description: 'Únete a esta compra colectiva y ahorra en manzanas frescas',
        product_id: productIdNum,
        target_quantity: 50,
        current_quantity: 32,
        target_price: 1500,
        current_price: 1800,
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        participants: 8,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      data: mockCampaigns,
    });
  } catch (error) {
    console.error('Error fetching product campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener las campañas del producto',
    });
  }
});

// GET /api/campaigns/:id - Get campaign by ID
campaignsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const campaignId = parseInt(id, 10);

    if (isNaN(campaignId)) {
      res.status(400).json({
        success: false,
        message: 'ID de campaña inválido',
      });
      return;
    }

    // Mock campaign data
    const mockCampaign = {
      id: campaignId,
      name: 'Compra Colectiva de Manzanas',
      description: 'Únete a esta compra colectiva y ahorra en manzanas frescas',
      product_id: 1,
      target_quantity: 50,
      current_quantity: 32,
      target_price: 1500,
      current_price: 1800,
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      participants: 8,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: mockCampaign,
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener la campaña',
    });
  }
});

// POST /api/campaigns/:id/join - Join a campaign (mock endpoint)
campaignsRouter.post('/:id/join', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const campaignId = parseInt(id, 10);
    const { quantity, amount } = req.body;

    if (isNaN(campaignId) || !quantity || !amount) {
      res.status(400).json({
        success: false,
        message: 'Datos inválidos',
      });
      return;
    }

    // Mock successful join
    res.json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        campaign_id: campaignId,
        user_id: 1, // Mock user ID
        quantity,
        committed_amount: amount,
        created_at: new Date().toISOString(),
      },
      message: 'Te has unido a la campaña exitosamente',
    });
  } catch (error) {
    console.error('Error joining campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al unirse a la campaña',
    });
  }
});
