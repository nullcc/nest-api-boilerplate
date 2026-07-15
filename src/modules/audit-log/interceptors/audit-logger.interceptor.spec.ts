import { redactSensitiveData } from './audit-logger.interceptor';

describe('redactSensitiveData', () => {
  it('should redact sensitive fields recursively', () => {
    expect(
      redactSensitiveData({
        email: 'john@doe.me',
        password: 'Pa$$w0rd',
        nested: {
          Authorization: 'Bearer j.w.t',
          refresh_token: 'refresh-token',
          value: 'visible',
        },
        items: [
          {
            token: 'token',
            name: 'item',
          },
        ],
      }),
    ).toEqual({
      email: 'john@doe.me',
      password: '[REDACTED]',
      nested: {
        Authorization: '[REDACTED]',
        refresh_token: '[REDACTED]',
        value: 'visible',
      },
      items: [
        {
          token: '[REDACTED]',
          name: 'item',
        },
      ],
    });
  });
});
