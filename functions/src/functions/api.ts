import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { errorHandler } from '../middlewares';
import { loggerMiddleware } from '../middlewares/logger';
import {
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
app.use(loggerMiddleware);

// Add a health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/status', statusRouter);
app.use('/usuarios', usersRouter);
app.use('/suppliers', suppliersRouter);
app.use('/customers', customersRouter);
app.use('/productos', productosRouter);
app.use('/categories', categoriesRouter);
app.use('/comunas', comunasRouter);

// Error handler should be last
app.use(errorHandler);

// Configure the Cloud Function with appropriate settings
export const api = onRequest(
  {
    cors: true,
    timeoutSeconds: 15,
    memory: '512MiB',
    region: 'southamerica-west1',
    invoker: 'public',
  },
  app,
);
