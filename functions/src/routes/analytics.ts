import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schema for tracking events
const trackEventSchema = z.object({
  tipo_evento: z.enum([
    'product_view',
    'add_to_cart',
    'remove_from_cart',
    'supplier_profile_view',
    'campaign_view',
    'campaign_join',
    'begin_checkout',
    'purchase',
    'search'
  ]),
  id_usuario: z.number().int().positive().optional(),
  id_proveedor: z.number().int().positive().optional(),
  id_producto: z.number().int().positive().optional(),
  id_campana: z.number().int().positive().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  session_id: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
  referrer: z.string().optional(),
  page_url: z.string().optional(),
});

// POST /analytics/track - Record an analytics event
router.post('/track', async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = trackEventSchema.parse(req.body);

    const evento = await prisma.eventos_analytics.create({
      data: {
        tipo_evento: validatedData.tipo_evento,
        id_usuario: validatedData.id_usuario,
        id_proveedor: validatedData.id_proveedor,
        id_producto: validatedData.id_producto,
        id_campana: validatedData.id_campana,
        metadata: validatedData.metadata || {},
        session_id: validatedData.session_id,
        user_agent: validatedData.user_agent || req.get('user-agent'),
        ip_address: validatedData.ip_address || req.ip,
        referrer: validatedData.referrer,
        page_url: validatedData.page_url,
      },
    });

    // Convert BigInt to string for JSON serialization
    res.status(201).json({ success: true, id_evento: evento.id_evento.toString() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    } else {
      console.error('Error tracking event:', error);
      return res.status(500).json({ error: 'Failed to track event' });
    }
  }
});

// GET /analytics/suppliers/:id/overview - Get supplier KPI overview
router.get('/suppliers/:id/overview', async (req: Request, res: Response): Promise<any> => {
  try {
    const supplierId = parseInt(req.params.id);
    const { startDate, endDate } = req.query;

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const dateFilter: any = { id_proveedor: supplierId };
    if (startDate && endDate) {
      dateFilter.created_at = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    // Get total profile views
    const profileViews = await prisma.eventos_analytics.count({
      where: {
        ...dateFilter,
        tipo_evento: 'supplier_profile_view',
      },
    });

    // Get unique visitors (distinct session_id)
    const uniqueVisitors = await prisma.eventos_analytics.findMany({
      where: {
        ...dateFilter,
        tipo_evento: 'supplier_profile_view',
      },
      distinct: ['session_id'],
      select: { session_id: true },
    });

    // Get total product views
    const productViews = await prisma.eventos_analytics.count({
      where: {
        ...dateFilter,
        tipo_evento: 'product_view',
      },
    });

    // Get cart additions
    const cartAdditions = await prisma.eventos_analytics.count({
      where: {
        ...dateFilter,
        tipo_evento: 'add_to_cart',
      },
    });

    // Get purchases
    const purchases = await prisma.eventos_analytics.count({
      where: {
        ...dateFilter,
        tipo_evento: 'purchase',
      },
    });

    // Get campaign joins
    const campaignJoins = await prisma.eventos_analytics.count({
      where: {
        ...dateFilter,
        tipo_evento: 'campaign_join',
      },
    });

    // Calculate conversion rates
    const addToCartRate = productViews > 0 ? (cartAdditions / productViews) * 100 : 0;
    const purchaseRate = cartAdditions > 0 ? (purchases / cartAdditions) * 100 : 0;
    const overallConversionRate = profileViews > 0 ? (purchases / profileViews) * 100 : 0;

    res.json({
      supplierId,
      period: { startDate, endDate },
      metrics: {
        profileViews,
        uniqueVisitors: uniqueVisitors.length,
        productViews,
        cartAdditions,
        purchases,
        campaignJoins,
        addToCartRate: parseFloat(addToCartRate.toFixed(2)),
        purchaseRate: parseFloat(purchaseRate.toFixed(2)),
        overallConversionRate: parseFloat(overallConversionRate.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Error fetching supplier overview:', error);
    return res.status(500).json({ error: 'Failed to fetch supplier overview' });
  }
});

// GET /analytics/suppliers/:id/products - Get product performance for supplier
router.get('/suppliers/:id/products', async (req: Request, res: Response): Promise<any> => {
  try {
    const supplierId = parseInt(req.params.id);
    const { startDate, endDate, limit = '10' } = req.query;

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    // Get all products for this supplier
    const productsWithStats = await prisma.productos.findMany({
      where: { id_proveedor: supplierId },
      select: {
        id_producto: true,
        nombre_producto: true,
        precio_unitario: true,
        imagen_url: true,
        eventos_analytics: {
          where: dateFilter,
          select: {
            tipo_evento: true,
            id_evento: true,
          },
        },
      },
    });

    // Process product statistics
    const productStats = productsWithStats.map((product) => {
      const views = product.eventos_analytics.filter((e) => e.tipo_evento === 'product_view').length;
      const cartAdds = product.eventos_analytics.filter((e) => e.tipo_evento === 'add_to_cart').length;
      const purchases = product.eventos_analytics.filter((e) => e.tipo_evento === 'purchase').length;

      const addToCartRate = views > 0 ? (cartAdds / views) * 100 : 0;
      const conversionRate = cartAdds > 0 ? (purchases / cartAdds) * 100 : 0;

      return {
        id_producto: product.id_producto,
        nombre_producto: product.nombre_producto,
        precio_unitario: product.precio_unitario,
        imagen_url: product.imagen_url,
        views,
        cartAdds,
        purchases,
        addToCartRate: parseFloat(addToCartRate.toFixed(2)),
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      };
    });

    // Sort by views (most popular first) and limit
    const topProducts = productStats
      .sort((a, b) => b.views - a.views)
      .slice(0, parseInt(limit as string));

    res.json({
      supplierId,
      period: { startDate, endDate },
      products: topProducts,
      totalProducts: productStats.length,
    });
  } catch (error) {
    console.error('Error fetching product performance:', error);
    return res.status(500).json({ error: 'Failed to fetch product performance' });
  }
});

// GET /analytics/suppliers/:id/trends - Get time-series trends for supplier
router.get('/suppliers/:id/trends', async (req: Request, res: Response): Promise<any> => {
  try {
    const supplierId = parseInt(req.params.id);
    const { startDate, endDate, interval = 'day' } = req.query;

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const dateFilter: any = { id_proveedor: supplierId };
    if (startDate && endDate) {
      dateFilter.created_at = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    // Get all events in the date range
    const events = await prisma.eventos_analytics.findMany({
      where: dateFilter,
      orderBy: { created_at: 'asc' },
      select: {
        tipo_evento: true,
        created_at: true,
      },
    });

    // Group events by date
    const trendMap = new Map<string, any>();

    events.forEach((event) => {
      let dateKey: string;
      
      if (interval === 'hour') {
        dateKey = event.created_at.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      } else if (interval === 'week') {
        const date = new Date(event.created_at);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        dateKey = weekStart.toISOString().slice(0, 10); // YYYY-MM-DD (Monday)
      } else if (interval === 'month') {
        dateKey = event.created_at.toISOString().slice(0, 7); // YYYY-MM
      } else {
        // Default to day
        dateKey = event.created_at.toISOString().slice(0, 10); // YYYY-MM-DD
      }

      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, {
          date: dateKey,
          profileViews: 0,
          productViews: 0,
          cartAdditions: 0,
          purchases: 0,
          campaignJoins: 0,
        });
      }

      const trend = trendMap.get(dateKey);
      
      switch (event.tipo_evento) {
        case 'supplier_profile_view':
          trend.profileViews++;
          break;
        case 'product_view':
          trend.productViews++;
          break;
        case 'add_to_cart':
          trend.cartAdditions++;
          break;
        case 'purchase':
          trend.purchases++;
          break;
        case 'campaign_join':
          trend.campaignJoins++;
          break;
      }
    });

    const trends = Array.from(trendMap.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );

    res.json({
      supplierId,
      period: { startDate, endDate },
      interval,
      trends,
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;
