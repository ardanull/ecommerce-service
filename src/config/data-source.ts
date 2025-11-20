import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Product } from '../modules/products/product.entity';
import { Category } from '../modules/categories/category.entity';
import { Order } from '../modules/orders/order.entity';
import { OrderItem } from '../modules/orders/orderItem.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'ecom_user',
  password: process.env.DB_PASSWORD || 'ecom_password',
  database: process.env.DB_NAME || 'ecom_db',
  entities: [Product, Category, Order, OrderItem],
  synchronize: true, // Prod için migration'a çevrilebilir
  logging: false
});
