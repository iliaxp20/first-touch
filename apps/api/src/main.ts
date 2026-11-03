import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. HTTP Security Headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:4000', 'http://localhost:5173', 'ws://localhost:4001', 'ws:', 'wss:'],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // 2. Cookie Parser
  app.use(cookieParser());

  // 3. Strict CORS configuration
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  const defaultAllowed = ['http://localhost:3000', 'http://localhost:5173'];
  const allowedOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map((o) => o.trim())
    : defaultAllowed;

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('درخواست توسط سیاست امنیتی CORS مسدود گردید.'));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 3600,
  });

  // 4. Global Exception Filter (Error Sanitization)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Global Validation Pipe with DTO transformation & Non-whitelisted rejection
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  // 6. Swagger API Documentation (Disabled or scoped)
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('First Touch (فرست تاچ) API')
      .setDescription('Football Coach & Student Management Platform API - Secured')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('📖 Swagger documentation available at /api/docs');
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 First Touch API safely running on port ${port}`);
}

bootstrap();
