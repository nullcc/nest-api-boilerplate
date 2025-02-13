import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsEmail } from 'class-validator';

export class SignIn {
  @ApiProperty({
    required: true,
    description: 'User email',
  })
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
    description: 'User password',
  })
  @IsDefined()
  @IsNotEmpty()
  readonly password: string;
}
