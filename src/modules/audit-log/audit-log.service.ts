import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';
import { AUDIT_LOG_PAGINATION_CONFIG } from '@modules/audit-log/pagination.config';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly logger: Logger,
  ) {}

  public findAll(query: PaginateQuery): Promise<Paginated<AuditLog>> {
    return paginate(query, this.auditLogRepository, AUDIT_LOG_PAGINATION_CONFIG);
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
