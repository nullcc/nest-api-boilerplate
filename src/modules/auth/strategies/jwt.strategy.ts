import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { User } from '@modules/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const extractJwtFromCookie: JwtFromRequestFunction = (request) => {
  return request.signedCookies['token']!;
};

export const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  extractJwtFromCookie,
  ExtractJwt.fromUrlQueryParameter('token'),
  ExtractJwt.fromBodyField('token'),
  ExtractJwt.fromHeader('X-Token'),
]);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest,
      secretOrKey: process.env.APP_SECRET,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.authService.verifyPayload(payload);
  }
}
