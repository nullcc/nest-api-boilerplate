import Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor() {
    super(
      {
        passReqToCallback: true,
        server: {
          url: process.env.LDAP_URL,
          bindDN: process.env.LDAP_BIND_DN,
          bindCredentials: process.env.LDAP_BIND_CREDENTIALS,
          searchBase: process.env.LDAP_SEARCH_BASE,
          searchFilter: process.env.LDAP_SEARCH_FILTER,
        },
        usernameField: 'name',
      },
      async (req: Request, user: any, done) => {
        const userData = { name: user.uid, email: user.mail };
        (req as any).user = userData;
        return done(null, userData);
      },
    );
  }
}
