import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';

import { User } from '@modules/user/entities/user.entity';

// https://github.com/ppetzold/nestjs-paginate
export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'name', 'email'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'email', 'role', 'status'],
  select: ['id', 'name', 'email', 'role', 'status'],
  filterableColumns: {
    name: [
      FilterOperator.EQ,
      FilterOperator.IN,
      FilterOperator.ILIKE,
      FilterSuffix.NOT,
    ],
    email: [
      FilterOperator.EQ,
      FilterOperator.IN,
      FilterOperator.ILIKE,
      FilterSuffix.NOT,
    ],
    role: [FilterOperator.EQ, FilterOperator.IN, FilterSuffix.NOT],
    status: [FilterOperator.EQ, FilterOperator.IN, FilterSuffix.NOT],
  },
};
