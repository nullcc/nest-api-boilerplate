import { existsSync, readFileSync } from 'fs';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';

const numberFromEnv = (name: string, defaultValue: number): number => {
  const value = process.env[name];
  if (!value) {
    return defaultValue;
  }
  return parseInt(value, 10);
};

const booleanFromEnv = (name: string, defaultValue = false): boolean => {
  const value = process.env[name];
  if (!value) {
    return defaultValue;
  }
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const getDatabaseSsl = () => {
  const sslMode =
    process.env.DATABASE_SSL_MODE ?? process.env.SSL_MODE ?? 'disable';
  if (sslMode === 'disable') {
    return false;
  }

  const caPath = process.env.DATABASE_SSL_CA;
  return {
    rejectUnauthorized: sslMode !== 'require',
    ...(caPath && existsSync(caPath)
      ? { ca: readFileSync(caPath, 'utf8') }
      : {}),
  };
};

const getBaseDataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: numberFromEnv('DATABASE_PORT', 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrationsRun: false,
  logging: booleanFromEnv('DATABASE_LOGGING'),
  extra: {
    max: numberFromEnv('DATABASE_POOL_MAX', 10),
    idleTimeoutMillis: numberFromEnv('DATABASE_POOL_IDLE_TIMEOUT_MS', 30000),
    connectionTimeoutMillis: numberFromEnv(
      'DATABASE_POOL_CONNECTION_TIMEOUT_MS',
      5000,
    ),
    ssl: getDatabaseSsl(),
  },
});

export const createTypeOrmOptions = (): TypeOrmModuleOptions => ({
  ...getBaseDataSourceOptions(),
  autoLoadEntities: true,
});

export const createDataSourceOptions = (): DataSourceOptions &
  SeederOptions => ({
  ...getBaseDataSourceOptions(),
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  factories: [__dirname + '/../**/testing/*.factory{.ts,.js}'],
  seeds: [__dirname + '/../**/testing/*.seeder{.ts,.js}'],
});
