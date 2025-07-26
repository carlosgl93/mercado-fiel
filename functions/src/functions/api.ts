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

app.use('/status', statusRouter);
app.use('/usuarios', usersRouter);
app.use('/suppliers', suppliersRouter);
app.use('/customers', customersRouter);
app.use('/productos', productosRouter);
app.use('/categories', categoriesRouter);
app.use('/comunas', comunasRouter);
// Add more routes as needed
// Add more routes here...
app.use(errorHandler);

export const api = onRequest({ cors: true, timeoutSeconds: 60 }, app);
