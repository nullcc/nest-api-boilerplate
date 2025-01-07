import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { User } from '@modules/user/entities/user.entity';
import { Status } from '@modules/user/enums/status.enum';
import { Role } from '@modules/user/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  // see https://github.com/ppetzold/nestjs-paginate
  private readonly paginationConfig: PaginateConfig<User> = {
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

  async create(data: Partial<User>): Promise<User> {
    data.role = Role.User;
    data.status = Status.Enabled;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, this.paginationConfig);
  }

  async findUser(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });
    delete user.password;
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne({ where: { id } });
    user.name = data.name;
    user.role = data.role;
    user.status = data.status;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });
    user.status = Status.Disabled;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async findOne(where: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }
    return user;
  }
}
