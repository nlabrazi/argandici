import { Handler } from '@netlify/functions';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from '../../api/src/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  const expressApp = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    bodyParser: false, // pour Stripe
  });

  app.use('/webhooks/stripe', express.raw({ type: () => true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://argandici.com',
      'https://www.argandici.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context);
};
