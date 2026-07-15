import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';

export const middleware = (app: INestApplication): INestApplication => {
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(compression());

  app.use(passport.initialize());

  // https://github.com/graphql/graphql-playground/issues/1283#issuecomment-703631091
  // https://github.com/graphql/graphql-playground/issues/1283#issuecomment-1012913186
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: isProduction ? undefined : false,
    }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  return app;
};
