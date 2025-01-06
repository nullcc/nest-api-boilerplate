import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUp } from '@modules/auth/dtos/sign-up.dto';
import { AuthUser } from '@modules/user/decorators/user.decorator';
import { User } from '@modules/user/entities/user.entity';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '@modules/auth/decorators/route.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: SignUp): Promise<User> {
    return this.authService.register(signUp);
  }

  @Public()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async login(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Get('/me')
  @UseGuards(JWTAuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }
}
