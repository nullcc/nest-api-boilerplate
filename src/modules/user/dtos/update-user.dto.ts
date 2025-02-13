import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsEnum } from 'class-validator';

import { Role } from '@modules/user/enums/role.enum';
import { Status } from '@modules/user/enums/status.enum';

export class UpdateUserDto {
  @ApiProperty({
    required: true,
    description: 'User name',
  })
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    required: true,
    enum: Role,
    description: 'User role',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;

  @ApiProperty({
    required: true,
    enum: Status,
    description: 'User status',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Status)
  @ApiProperty({
    enum: Status,
  })
  readonly status: Status;
}
