import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { createMock } from 'ts-auto-mock';

import { AuthService } from '@modules/auth/auth.service';
import { JWTAuthGuard } from './jwt-auth.guard';
import { User } from '@modules/user/entities/user.entity';
import { Status } from '@modules/user/enums/status.enum';

const createContext = (request: Record<string, unknown>): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as unknown as ExecutionContext;

describe('JWTAuthGuard', () => {
  let guard: JWTAuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    jwtService = createMock<JwtService>() as jest.Mocked<JwtService>;
    authService = createMock<AuthService>() as jest.Mocked<AuthService>;

    guard = new JWTAuthGuard(
      jwtService,
      createMock<ConfigService>({
        getOrThrow: jest.fn().mockReturnValue('secret'),
      }),
      createMock<Reflector>({
        getAllAndOverride: jest.fn().mockReturnValue(false),
      }),
      authService,
    );
  });

  it('should attach the verified active user to the request', async () => {
    const request = {
      headers: {
        authorization: 'Bearer j.w.t',
      },
    };
    const payload = {
      id: 1,
      email: 'john@doe.me',
      name: 'John Doe',
      roles: ['user'],
    };
    const user = createMock<User>({
      id: 1,
      email: payload.email,
      status: Status.Enabled,
    });

    jwtService.verifyAsync.mockResolvedValueOnce(payload);
    authService.verifyPayload.mockResolvedValueOnce(user);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(request['user']).toBe(user);
    expect(authService.verifyPayload).toHaveBeenCalledWith(payload);
  });

  it('should reject a token when payload verification fails', async () => {
    const request = {
      headers: {
        authorization: 'Bearer j.w.t',
      },
    };

    jwtService.verifyAsync.mockResolvedValueOnce({
      id: 1,
      email: 'disabled@example.com',
    });
    authService.verifyPayload.mockRejectedValueOnce(new UnauthorizedException());

    await expect(guard.canActivate(createContext(request))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
