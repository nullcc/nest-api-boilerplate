import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';

import { IsUserAlreadyExist } from '@modules/user/validators/is-user-already-exist.validator';

export class SignUp {
  @ApiProperty({
    required: true,
    description: 'User email',
  })
  @IsDefined()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @ApiProperty({
    required: true,
    description: 'User name',
  })
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    required: true,
    description: 'User password',
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
