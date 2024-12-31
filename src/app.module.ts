import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { LoggerFactory } from '@libs/logger/logger.factory';
import typeORMconfig from '@config/typeorm';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { HealthController } from '@modules/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const loggerFactory = new LoggerFactory(config);
        return loggerFactory.create();
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeORMconfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
    }),
    TerminusModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
  controllers: [HealthController],
  providers: [Logger],
})
export class AppModule {}
