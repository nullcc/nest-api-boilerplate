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
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
