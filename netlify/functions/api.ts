// netlify/functions/api.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../api/src/app.module'; // On va chercher ton AppModule
import serverless from 'serverless-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Assure-toi que ton préfixe global est bien ici
  app.setGlobalPrefix('api');

  await app.init();
  const handler = serverless(app.getHttpAdapter().getInstance());
  return handler;
}

// On exporte le handler pour que Netlify puisse l'utiliser
export const handler = bootstrap();
