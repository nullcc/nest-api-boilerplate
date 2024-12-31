import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUp } from './dtos/sign-up.dto';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async register(signUp: SignUp): Promise<User> {
    const user = await this.userService.create(signUp);
    delete user.password;
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne({ where: { email } });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }
    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }
    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne({ where: { email: payload.email } });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.email}`,
      );
    }
    return user;
  }

  signToken(user: User): string {
    const payload = {
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}
