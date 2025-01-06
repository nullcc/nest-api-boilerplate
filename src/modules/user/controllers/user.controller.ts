import { Controller, Delete, Logger, Param } from '@nestjs/common';

import { UserService } from '@modules/user/services/user.service';
import { Roles } from '@modules/user/decorators/roles.decorator';
import { Role } from '@modules/user/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Delete('/:id')
  @Roles(Role.Admin)
  async disable(@Param('id') id: number) {
    return await this.userService.disableUser(id);
  }
}
