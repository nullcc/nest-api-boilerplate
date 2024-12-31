import { join } from 'path';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';

const setupLogger = (app: NestExpressApplication) => {
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
};

const setupApiDoc = (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Nest API Boilerplate')
    .setDescription('Nest API Boilerplate API Description')
    .setVersion('1.0')
    .addTag('Nest API Boilerplate')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
};

const setupGlobalPipes = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
};

const setupViewEngine = (app: NestExpressApplication) => {
  app.useStaticAssets(join(__dirname, '../public', 'assets'));
  app.setBaseViewsDir(join(__dirname, '../public', 'views'));
  app.setViewEngine('ejs');
};

export function setup(app: NestExpressApplication): NestExpressApplication {
  setupLogger(app);

  setupApiDoc(app);

  setupGlobalPipes(app);

  setupViewEngine(app);

  middleware(app);

  app.enableShutdownHooks();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
