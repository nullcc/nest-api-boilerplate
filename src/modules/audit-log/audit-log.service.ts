import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly logger: Logger,
  ) {}

  // see https://github.com/ppetzold/nestjs-paginate
  private readonly paginationConfig: PaginateConfig<AuditLog> = {
    sortableColumns: ['id', 'userId'],
    nullSort: 'last',
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['userId', 'ip', 'description'],
    select: ['id', 'userId', 'ip', 'description', 'parameters'],
    filterableColumns: {
      userId: [FilterOperator.EQ],
      ip: [FilterOperator.EQ],
      description: [FilterOperator.ILIKE],
    },
  };

  public findAll(query: PaginateQuery): Promise<Paginated<AuditLog>> {
    return paginate(query, this.auditLogRepository, this.paginationConfig);
  }

  async findAuditLog(id: number): Promise<AuditLog> {
    return await this.findOne({ where: { id } });
  }

  async findOne(where: FindOneOptions<AuditLog>): Promise<AuditLog> {
    const user = await this.auditLogRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `There isn't any audit log with identifier: ${JSON.stringify(where.where)}`,
      );
    }
    return user;
  }
}
