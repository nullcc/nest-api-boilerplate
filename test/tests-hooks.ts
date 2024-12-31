import { IntegreSQLClient } from '@devoxa/integresql-client';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getConfigToken } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { AppModule } from '@src/app.module';
import { dataSourceOptions } from '@src/config/data-source';
import { setup } from '@src/setup';

const client = new IntegreSQLClient({
  url: process.env.INTEGRESQL_URL ?? 'http://localhost:5000',
});

export async function initializeIntegreSQL() {
  const hash = await client.hashFiles([
    './src/migrations/**/*',
    './src/**/testing/*',
    './src/config/data-source.ts',
  ]);

  await client.initializeTemplate(
    hash,
    async ({ database, password, port, username }) => {
      const dataSource = new DataSource({
        ...dataSourceOptions,
        username,
        password,
        database,
        port,
      } as any);

      await dataSource.initialize();
      await dataSource.runMigrations();
      await runSeeders(dataSource);
      await dataSource.destroy();
    },
  );

  return hash;
}

export async function bootstrapApp(hash: string): Promise<NestExpressApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getConfigToken('typeorm'))
    .useFactory({
      async factory() {
        const { database, password, port, username } =
          await client.getTestDatabase(hash);

        return {
          type: 'postgres',
          autoLoadEntities: true,
          username,
          password,
          database,
          port,
        };
      },
    })
    .compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();

  setup(app);

  return app.init();
}
