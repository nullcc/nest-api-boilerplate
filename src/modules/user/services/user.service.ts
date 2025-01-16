import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

import { User } from '@modules/user/entities/user.entity';
import { Status } from '@modules/user/enums/status.enum';
import { Role } from '@modules/user/enums/role.enum';
import { USER_PAGINATION_CONFIG } from '@modules/user/pagination.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    data.role = Role.User;
    data.status = Status.Enabled;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, USER_PAGINATION_CONFIG);
  }

  async findUser(id: number): Promise<User> {
    return await this.findOne({ where: { id } });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne({ where: { id } });
    user.name = data.name;
    user.role = data.role;
    user.status = data.status;
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });
    user.status = Status.Disabled;
    await this.userRepository.save(user);
    return user;
  }

  async findOne(where: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${JSON.stringify(where.where)}`,
      );
    }
    return user;
  }
}
