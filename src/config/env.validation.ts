import { ConfigModuleOptions } from '@nestjs/config';

type Env = Record<string, string | undefined>;

const required = (env: Env, key: string): string => {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optionalPort = (env: Env, key: string): void => {
  const value = env[key];
  if (!value) {
    return;
  }
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Environment variable ${key} must be a valid TCP port`);
  }
};

const optionalPositiveInteger = (env: Env, key: string): void => {
  const value = env[key];
  if (!value) {
    return;
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer`);
  }
};

const optionalBoolean = (env: Env, key: string): void => {
  const value = env[key];
  if (!value) {
    return;
  }
  if (
    !['1', '0', 'true', 'false', 'yes', 'no', 'on', 'off'].includes(
      value.toLowerCase(),
    )
  ) {
    throw new Error(`Environment variable ${key} must be a boolean`);
  }
};

const optionalOneOf = (env: Env, key: string, values: string[]): void => {
  const value = env[key];
  if (!value) {
    return;
  }
  if (!values.includes(value)) {
    throw new Error(
      `Environment variable ${key} must be one of: ${values.join(', ')}`,
    );
  }
};

const validateProductionSecret = (env: Env): void => {
  if (env.NODE_ENV !== 'production') {
    return;
  }
  const secret = required(env, 'APP_SECRET');
  if (secret.length < 32 || secret === 'YOLO') {
    throw new Error('APP_SECRET must be at least 32 characters in production');
  }
};

const validateProductionCors = (env: Env): void => {
  if (env.NODE_ENV !== 'production') {
    return;
  }
  required(env, 'ALLOWED_ORIGINS');
};

const validateDatabaseSsl = (env: Env): void => {
  const sslMode = env.DATABASE_SSL_MODE ?? env.SSL_MODE;
  optionalOneOf(env, 'DATABASE_SSL_MODE', [
    'disable',
    'require',
    'verify-ca',
    'verify-full',
  ]);
  optionalOneOf(env, 'SSL_MODE', [
    'disable',
    'require',
    'verify-ca',
    'verify-full',
  ]);
  if (
    (sslMode === 'verify-ca' || sslMode === 'verify-full') &&
    !env.DATABASE_SSL_CA
  ) {
    throw new Error(
      'DATABASE_SSL_CA is required when DATABASE_SSL_MODE verifies certificates',
    );
  }
};

const validateRedisConfig = (env: Env): void => {
  if ((env.REDIS_PORT || env.REDIS_PASSWORD) && !env.REDIS_HOST) {
    throw new Error(
      'REDIS_HOST is required when Redis port or password is set',
    );
  }
};

export const validateEnv: ConfigModuleOptions['validate'] = (config) => {
  const env = config as Env;

  required(env, 'APP_SECRET');
  required(env, 'DATABASE_HOST');
  required(env, 'DATABASE_PORT');
  required(env, 'DATABASE_USER');
  required(env, 'DATABASE_PASSWORD');
  required(env, 'DATABASE_NAME');

  optionalPort(env, 'PORT');
  optionalPort(env, 'DATABASE_PORT');
  optionalPort(env, 'REDIS_PORT');
  optionalBoolean(env, 'API_DOCS_ENABLED');
  optionalBoolean(env, 'DATABASE_LOGGING');
  optionalPositiveInteger(env, 'DATABASE_POOL_MAX');
  optionalPositiveInteger(env, 'DATABASE_POOL_IDLE_TIMEOUT_MS');
  optionalPositiveInteger(env, 'DATABASE_POOL_CONNECTION_TIMEOUT_MS');
  optionalPositiveInteger(env, 'CACHE_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_SHORT_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_SHORT_LIMIT');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_MEDIUM_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_MEDIUM_LIMIT');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_LONG_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_LONG_LIMIT');
  validateDatabaseSsl(env);
  validateRedisConfig(env);
  validateProductionSecret(env);
  validateProductionCors(env);

  return config;
};
