import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';


async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: isProd, // strict in prod
      crossOriginOpenerPolicy: { policy: isProd ? 'same-origin' : 'unsafe-none' },
      crossOriginResourcePolicy: { policy: isProd ? 'same-origin' : 'cross-origin' },
      hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : undefined,
      hidePoweredBy: true,
      noSniff: true,
      referrerPolicy: { policy: 'no-referrer' },
    })
  );

  const versionStr = config.get<string>('Version') || '1';
  const major = versionStr.match(/\d/)?.[0] || '1';
  app.setGlobalPrefix(`api/v${major}`);
  app.use(cookieParser());


  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://9jh9rzt5-3000.asse.devtunnels.ms',
    'https://9jh9rzt5-3001.asse.devtunnels.ms',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials', 'X-CSRF-Token'],
  });

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);
  const url = await app.getUrl();
  const displayUrl = url.replace('[::1]', 'localhost');
  Logger.log(`Nest application successfully started at ${displayUrl}`, 'Bootstrap');
}
bootstrap();
