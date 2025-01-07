import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
} from '@nestjs/common';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

import { UserService } from '@modules/user/services/user.service';
import { User } from '@modules/user/entities/user.entity';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from '@modules/user/enums/role.enum';
import { UpdateUserDto } from '@modules/user/dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Get()
  public findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAll(query);
  }

  @Get('/:id')
  public findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findUser(id);
  }

  @Patch('/:id')
  public update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
