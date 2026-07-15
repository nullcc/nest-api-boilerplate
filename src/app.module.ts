import { Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { getLoggerOptions } from '@config/logger';
import typeORMconfig from '@config/typeorm';
import { getThrottlerOptions } from '@config/throttler';
import { validateEnv } from '@config/env.validation';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuditLogModule } from '@modules/audit-log/audit-log.module';
import { UserModule } from '@modules/user/user.module';
import { AppController } from '@src/app.controller';

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      envFilePath: `.env${process.env.APP_ENV ? '.' + process.env.APP_ENV : ''}`,
      isGlobal: true,
      validate: validateEnv,
    }),
    // Logger
    // https://getpino.io
    // https://github.com/iamolegga/nestjs-pino
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getLoggerOptions(config),
    }),
    // Database
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeORMconfig)],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('typeorm'),
      }),
    }),
    // Caching
    // https://docs.nestjs.com/techniques/caching
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<string>('CACHE_TTL')
          ? parseInt(config.get<string>('CACHE_TTL'))
          : 60000,
      }),
      isGlobal: true,
    }),
    // Redis
    // https://github.com/liaoliaots/nestjs-redis
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
            password: config.get<string>('REDIS_PASSWORD'),
          },
        };
      },
    }),
    // Static Folder
    // https://docs.nestjs.com/recipes/serve-static
    // https://docs.nestjs.com/techniques/mvc
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    // Task Scheduling
    // https://docs.nestjs.com/techniques/task-scheduling
    ScheduleModule.forRoot(),
    // Healthchecks
    // https://docs.nestjs.com/recipes/terminus
    TerminusModule,
    // Rate Limiting
    // https://docs.nestjs.com/security/rate-limiting
    ThrottlerModule.forRoot(getThrottlerOptions()),
    HealthModule,
    AuthModule,
    AuditLogModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
