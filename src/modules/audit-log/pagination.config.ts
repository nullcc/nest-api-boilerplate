import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';

// https://github.com/ppetzold/nestjs-paginate
export const AUDIT_LOG_PAGINATION_CONFIG: PaginateConfig<AuditLog> = {
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
