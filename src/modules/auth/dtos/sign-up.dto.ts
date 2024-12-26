import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';

import { IsUserAlreadyExist } from '@modules/user/validators/is-user-already-exist.validator';

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  @Validate(IsUserAlreadyExist)
  readonly name: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
