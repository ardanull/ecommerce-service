import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { json } from 'express';
import { productsRouter } from './modules/products/products.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { ordersRouter } from './modules/orders/orders.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ecommerce-service' });
  });

  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/orders', ordersRouter);

  app.use(errorHandler);

  return app;
}
