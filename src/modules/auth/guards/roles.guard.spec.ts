import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';
import { Role } from '@modules/user/enums/role.enum';

const createContext = (user?: unknown): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  it('should allow entity-style role fields', () => {
    const guard = new RolesGuard({
      getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]),
    } as unknown as Reflector);

    expect(guard.canActivate(createContext({ role: Role.Admin }))).toBe(true);
  });

  it('should allow jwt payload-style roles arrays', () => {
    const guard = new RolesGuard({
      getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]),
    } as unknown as Reflector);

    expect(guard.canActivate(createContext({ roles: [Role.Admin] }))).toBe(
      true,
    );
  });

  it('should deny missing users when a role is required', () => {
    const guard = new RolesGuard({
      getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]),
    } as unknown as Reflector);

    expect(() => guard.canActivate(createContext())).toThrow(
      ForbiddenException,
    );
  });
});
