import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from '@modules/auth/auth.service';
import { User } from '@modules/user/entities/user.entity';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';

export const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest,
      secretOrKey: config.getOrThrow<string>('APP_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: false,
      algorithms: ['HS384'],
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.authService.verifyPayload(payload);
  }
}
