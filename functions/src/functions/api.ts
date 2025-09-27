import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { errorHandler } from '../middlewares';
import { loggerMiddleware } from '../middlewares/logger';
import {
  authRouter,
  campaignsRouter,
  carritoRouter,
  categoriesRouter,
  customersRouter,
  productosRouter,
  statusRouter,
  suppliersRouter,
  usersRouter,
} from '../routes';
import { comunasRouter } from '../routes/comunas';

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// CORS middleware for additional safety
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://mercado-fiel.web.app', 
    'https://mercado-fiel.firebaseapp.com',
    'https://mercadofiel.cl'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

app.use(loggerMiddleware);

// Add a health check endpoint
app.get('/status', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/auth', authRouter);
app.use('/status', statusRouter);
app.use('/usuarios', usersRouter);
app.use('/suppliers', suppliersRouter);
app.use('/customers', customersRouter);
app.use('/productos', productosRouter);
app.use('/categories', categoriesRouter);
app.use('/comunas', comunasRouter);
app.use('/carrito', carritoRouter);
app.use('/campaigns', campaignsRouter);

// Error handler should be last
app.use(errorHandler);

// Configure the Cloud Function with appropriate settings
export const api = onRequest(
  {
    cors: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://mercado-fiel.web.app',
      'https://mercado-fiel.firebaseapp.com',
      'https://mercadofiel.cl',
    ],
    timeoutSeconds: 15,
    memory: '512MiB',
    region: 'southamerica-west1',
    invoker: 'public',
  },
  app,
);
