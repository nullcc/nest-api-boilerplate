import { Global, Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';
import { AuditLoggerInterceptor } from '@modules/audit-log/interceptors/audit-logger.interceptor';
import { AuditLogController } from '@modules/audit-log/audit-log.controller';
import { AuditLogService } from '@modules/audit-log/audit-log.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggerInterceptor,
    },
  ],
})
export class AuditLogModule {}
