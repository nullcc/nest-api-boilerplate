import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsEnum } from 'class-validator';

import { Role } from '@modules/user/enums/role.enum';
import { Status } from '@modules/user/enums/status.enum';

export class UpdateUserDto {
  @IsDefined()
  readonly name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
  })
  readonly role: Role;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(Status)
  @ApiProperty({
    enum: Status,
  })
  readonly status: Status;
}
