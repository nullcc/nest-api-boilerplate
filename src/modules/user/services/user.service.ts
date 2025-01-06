import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { User } from '../entities/user.entity';
import { Status } from '../enums/status.enum';
import { Role } from '../enums/role.enum';

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

  async disableUser(id: number): Promise<User> {
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
