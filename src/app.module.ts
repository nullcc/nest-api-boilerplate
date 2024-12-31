import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { loggerOptions } from '@config/logger.config';
import typeORMconfig from '@config/typeorm';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { AppController } from '@src/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    // https://getpino.io
    // https://github.com/iamolegga/nestjs-pino
    LoggerModule.forRoot(loggerOptions),
    // Database
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeORMconfig)],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('typeorm'),
      }),
    }),
    // Static Folder
    // https://docs.nestjs.com/recipes/serve-static
    // https://docs.nestjs.com/techniques/mvc
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    TerminusModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
