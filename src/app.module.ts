import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { dataSourceOptions } from '@config/data-source';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { HealthController } from '@modules/health/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TerminusModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
