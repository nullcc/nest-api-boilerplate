import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  ) {}

  async register(signUp: SignUp): Promise<User> {
    const user = await this.userService.create(signUp);
    delete user.password;
    return user;
  }

  async login(name: string, password: string): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne({ where: { name } });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with name: ${name}`,
      );
    }
    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with name: ${name}`,
      );
    }
    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOne({ where: { name: payload.name } });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with name: ${payload.name}`,
      );
    }
    return user;
  }

  signToken(user: User): string {
    const payload = {
      name: user.name,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
