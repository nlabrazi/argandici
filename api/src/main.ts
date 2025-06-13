import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // --- CONFIG HERE ---
  app.use('/webhooks/stripe', express.raw({ type: () => true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // global prefix for all API routes
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:4000',
      'https://argandici.com',
      'https://www.argandici.com',
      // URL preview for staging if i can
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // --- NEW LOGIC ---
  // Vercel define variable env 'VERCEL'.
  // If doesn't exist we use local Docker.
  if (!process.env.VERCEL) {
    // If local, start server as usual.
    await app.listen(3000, '0.0.0.0');
    console.log(`🚀 API running locally on: ${await app.getUrl()}`);
  }

  // For Vercel, init app & return 'handler'.
  await app.init();
  return app.getHttpAdapter().getInstance();
}

// Export result & fonction for Vercel.
export default bootstrap();
