import type { Request } from 'express';

import { jwtFromRequest } from './jwt.strategy';

describe('jwtFromRequest', () => {
  it('should extract a bearer token from the authorization header', () => {
    const request = {
      headers: {
        authorization: 'Bearer j.w.t',
      },
    } as Request;

    expect(jwtFromRequest(request)).toBe('j.w.t');
  });

  it('should not extract tokens from query or body fields', () => {
    const request = {
      headers: {},
      query: { token: 'query-token' },
      body: { token: 'body-token' },
    } as unknown as Request;

    expect(jwtFromRequest(request)).toBeNull();
  });
});
