import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // --- Config here ---
  app.use('/webhooks/stripe', express.raw({ type: () => true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:4000',
      'https://argandici.com',
      'https://www.argandici.com',
      // URL preview for Netlify here
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // --- Start le serveur without condition ---
  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 API running for Docker on: ${await app.getUrl()}`);
}

bootstrap();
