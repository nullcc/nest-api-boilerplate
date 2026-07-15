import { createDataSourceOptions, createTypeOrmOptions } from './database';

const originalEnv = process.env;

describe('database config', () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_USER: 'postgres',
      DATABASE_PASSWORD: 'postgres',
      DATABASE_NAME: 'nestjs',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should share connection options between runtime and cli data sources', () => {
    process.env.DATABASE_POOL_MAX = '20';
    process.env.DATABASE_SSL_MODE = 'require';

    const runtimeOptions = createTypeOrmOptions();
    const cliOptions = createDataSourceOptions();
    const runtimeConnectionOptions = runtimeOptions as Record<string, unknown>;

    expect(runtimeOptions).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'nestjs',
      synchronize: false,
      extra: {
        max: 20,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
    expect(cliOptions).toMatchObject({
      host: runtimeConnectionOptions.host,
      port: runtimeConnectionOptions.port,
      username: runtimeConnectionOptions.username,
      password: runtimeConnectionOptions.password,
      database: runtimeConnectionOptions.database,
      extra: runtimeConnectionOptions.extra,
    });
  });
});
