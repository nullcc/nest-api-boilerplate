import { repl } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 * https://docs.nestjs.com/recipes/repl
 */
async function bootstrap() {
  await repl(AppModule);
}

bootstrap();
