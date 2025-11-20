import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { createApp } from './app';

const port = process.env.PORT || 4001;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const app = createApp();
    app.listen(port, () => {
      console.log(`E-commerce service listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start ecommerce-service', err);
    process.exit(1);
  }
}

bootstrap();
