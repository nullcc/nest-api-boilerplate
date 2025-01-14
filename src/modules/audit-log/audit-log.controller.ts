import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

import { AuditLogService } from '@modules/audit-log/audit-log.service';
import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';

@ApiTags('Audit Log')
@Controller('audit-logs')
@UseInterceptors(ClassSerializerInterceptor)
export class AuditLogController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly logger: Logger,
  ) {}

  @Get()
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<AuditLog>> {
    return this.auditLogService.findAll(query);
  }

  @Get('/:id')
  public findOne(@Param('id') id: number): Promise<AuditLog> {
    return this.auditLogService.findAuditLog(id);
  }
}
