import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { SignUp } from './dtos/sign-up.dto';
import { User } from '@modules/user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '@modules/user/services/user.service';
import { Status } from '@modules/user/enums/status.enum';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async register(signUp: SignUp): Promise<User> {
    const user = await this.userService.create(signUp);
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne({ where: { email } });
    } catch {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    if (
      user.status !== Status.Enabled ||
      !(await user.checkPassword(password))
    ) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne({
        where: { email: payload.email },
      });
    } catch {
      throw new UnauthorizedException();
    }
    if (user.status !== Status.Enabled) {
      throw new UnauthorizedException();
    }
    return user;
  }

  signToken(user: User): string {
    const payload: JwtPayload = {
      sub: String(user.id),
      jti: randomUUID(),
      id: user.id,
      email: user.email,
      name: user.name,
      roles: [user.role],
    };
    return this.jwtService.sign(payload);
  }
}
