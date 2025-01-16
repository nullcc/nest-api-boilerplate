import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@libs/dto/base.response.dto';
import { Role } from '@modules/user/enums/role.enum';
import { Status } from '@modules/user/enums/status.enum';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'User id',
  })
  id: number;

  @ApiProperty({
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    enum: Role,
    description: 'User role',
  })
  role: Role;

  @ApiProperty({
    enum: Status,
    description: 'User status',
  })
  status: Status;
}
