import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@vendia/serverless-express';

let cachedHandler;

async function bootstrap() {
  const expressApp = express();

  // Stripe Webhook raw body
  expressApp.use('/webhooks/stripe', express.raw({ type: () => true }));
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    bodyParser: false,
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['https://argandici.com', 'https://www.argandici.com'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();

  return serverlessExpress({ app: expressApp });
}

export const handler = async (event, context) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(event, context);
};
