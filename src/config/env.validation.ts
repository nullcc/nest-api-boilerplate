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
  optionalPositiveInteger(env, 'CACHE_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_SHORT_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_SHORT_LIMIT');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_MEDIUM_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_MEDIUM_LIMIT');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_LONG_TTL');
  optionalPositiveInteger(env, 'THROTTLER_LEVEL_LONG_LIMIT');
  validateProductionSecret(env);
  validateProductionCors(env);

  return config;
};
