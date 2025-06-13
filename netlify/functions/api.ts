// netlify/functions/api.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../api/src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Cette variable permet de ne pas redémarrer toute l'app à chaque requête
let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    // On s'assure que le préfixe est bien là
    nestApp.setGlobalPrefix('api');

    // On active CORS
    nestApp.enableCors();

    await nestApp.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export const handler = async (event, context) => {
  const server = await bootstrap();
  // On utilise directement le serveur Express avec le contexte de Netlify
  return new Promise((resolve, reject) => {
    server(event, context, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};
