import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setup } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setup(app);

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

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
