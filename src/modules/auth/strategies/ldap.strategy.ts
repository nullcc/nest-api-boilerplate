import Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private config: ConfigService) {
    super(
      {
        passReqToCallback: true,
        server: {
          url: config.get<string>('LDAP_URL'),
          bindDN: config.get<string>('LDAP_BIND_DN'),
          bindCredentials: config.get<string>('LDAP_BIND_CREDENTIALS'),
          searchBase: config.get<string>('LDAP_SEARCH_BASE'),
          searchFilter: config.get<string>('LDAP_SEARCH_FILTER'),
        },
        usernameField: 'email',
      },
      async (req: Request, user: any, done) => {
        const userData = { name: user.uid, email: user.mail };
        (req as any).user = userData;
        return done(null, userData);
      },
    );
  }
}
