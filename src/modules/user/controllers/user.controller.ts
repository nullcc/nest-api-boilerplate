import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
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

import { UserService } from '@modules/user/services/user.service';
import { AuditLog } from '@modules/audit-log/decorators/audit-log.decorator';
import { User } from '@modules/user/entities/user.entity';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from '@modules/user/enums/role.enum';
import { USER_PAGINATION_CONFIG } from '@modules/user/pagination.config';
import { UserResponseDto } from '@modules/user/dtos/user.response.dto';
import { UpdateUserDto } from '@modules/user/dtos/update-user.dto';

@ApiTags('User')
@Controller('users')
@Roles(Role.Admin)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkPaginatedResponse(UserResponseDto, USER_PAGINATION_CONFIG)
  @ApiPaginationQuery(USER_PAGINATION_CONFIG)
  public findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAll(query);
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  public findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findUser(id);
  }

  @Patch('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @AuditLog('Update user')
  public update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @AuditLog('Delete user')
  async delete(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
