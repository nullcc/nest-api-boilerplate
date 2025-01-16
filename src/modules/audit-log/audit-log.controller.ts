import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { AuditLogService } from '@modules/audit-log/audit-log.service';
import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';
import { AuditLogResponseDto } from '@modules/audit-log/dtos/audit-log.response.dto';
import { AUDIT_LOG_PAGINATION_CONFIG } from '@modules/audit-log/pagination.config';

@ApiTags('Audit Log')
@Controller('audit-logs')
@UseInterceptors(ClassSerializerInterceptor)
export class AuditLogController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkPaginatedResponse(AuditLogResponseDto, AUDIT_LOG_PAGINATION_CONFIG)
  @ApiPaginationQuery(AUDIT_LOG_PAGINATION_CONFIG)
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<AuditLog>> {
    return this.auditLogService.findAll(query);
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: AuditLogResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  public findOne(@Param('id') id: number): Promise<AuditLog> {
    return this.auditLogService.findAuditLog(id);
  }
}
