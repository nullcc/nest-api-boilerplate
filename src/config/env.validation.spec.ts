import { validateEnv } from './env.validation';

const validConfig = {
  APP_SECRET: 'local-secret',
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: '5432',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'postgres',
  DATABASE_NAME: 'nestjs',
};

describe('validateEnv', () => {
  it('should accept a valid local configuration', () => {
    expect(validateEnv(validConfig)).toEqual(validConfig);
  });

  it('should reject missing required variables', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        APP_SECRET: '',
      }),
    ).toThrow('Missing required environment variable: APP_SECRET');
  });

  it('should reject invalid ports', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        DATABASE_PORT: '99999',
      }),
    ).toThrow('Environment variable DATABASE_PORT must be a valid TCP port');
  });

  it('should reject invalid boolean values', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        DATABASE_LOGGING: 'maybe',
      }),
    ).toThrow('Environment variable DATABASE_LOGGING must be a boolean');
  });

  it('should reject partial redis configuration', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        REDIS_PASSWORD: 'secret',
      }),
    ).toThrow('REDIS_HOST is required when Redis port or password is set');
  });

  it('should reject weak production secrets', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        NODE_ENV: 'production',
        APP_SECRET: 'YOLO',
      }),
    ).toThrow('APP_SECRET must be at least 32 characters in production');
  });

  it('should require explicit production CORS origins', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        NODE_ENV: 'production',
        APP_SECRET: 'a-production-secret-with-enough-entropy',
      }),
    ).toThrow('Missing required environment variable: ALLOWED_ORIGINS');
  });

  it('should require a CA path for verifying database SSL modes', () => {
    expect(() =>
      validateEnv({
        ...validConfig,
        DATABASE_SSL_MODE: 'verify-full',
      }),
    ).toThrow(
      'DATABASE_SSL_CA is required when DATABASE_SSL_MODE verifies certificates',
    );
  });
});
