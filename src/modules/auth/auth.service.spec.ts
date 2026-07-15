import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';

import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { AuthService } from './auth.service';
import type { SignUp } from './dtos/sign-up.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { Status } from '@modules/user/enums/status.enum';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: jest.Mocked<UserService>;
  let mockedJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, Logger],
    })
      .useMocker((token) => {
        if (Object.is(token, UserService)) {
          return createMock<UserService>();
        }
        if (Object.is(token, JwtService)) {
          return createMock<JwtService>();
        }
      })
      .compile();

    service = module.get(AuthService);
    mockedUserService = module.get<UserService, jest.Mocked<UserService>>(
      UserService,
    );
    mockedJwtService = module.get<JwtService, jest.Mocked<JwtService>>(
      JwtService,
    );
  });

  it('should be an instanceof AuthService', () => {
    expect(service).toBeInstanceOf(AuthService);
  });

  it('should register a new user', async () => {
    const signUp: SignUp = {
      name: 'John Doe',
      email: 'john@doe.me',
      password: 'Pa$$w0rd',
    };

    mockedUserService.create.mockResolvedValueOnce(createMock<User>(signUp));
    const user = await service.register(signUp);

    expect(user).toHaveProperty('email', signUp.email);
    expect(user).toHaveProperty('name', signUp.name);
  });

  it('should log in an existing user', async () => {
    const email = 'john@doe.me';
    const password = 'Pa$$w0rd';

    mockedUserService.findOne.mockResolvedValueOnce(
      createMock<User>({
        email,
        status: Status.Enabled,
        checkPassword: jest.fn().mockResolvedValue(true),
      }),
    );
    const user = await service.login(email, password);

    expect(user).toHaveProperty('email', email);
  });

  it('should throw on log in when the email not exist', async () => {
    const email = 'notfound@example.com';
    /* spell-checker:dictionaries lorem-ipsum */
    const password = 'laboris-tempor-amet';

    mockedUserService.findOne.mockRejectedValueOnce('NotFound');

    await expect(
      service.login(email, password),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Invalid credentials"`);
  });

  it('should throw on log in when the email not exist', async () => {
    const email = 'john@doe.me';
    /* spell-checker:dictionaries lorem-ipsum */
    const password = 'Exercitation esse labore anim';

    mockedUserService.findOne.mockResolvedValueOnce(
      createMock<User>({
        email,
        status: Status.Enabled,
        checkPassword: jest.fn().mockResolvedValue(false),
      }),
    );

    await expect(
      service.login(email, password),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Invalid credentials"`);
  });

  it('should reject disabled users on log in', async () => {
    const email = 'john@doe.me';
    const password = 'Pa$$w0rd';

    mockedUserService.findOne.mockResolvedValueOnce(
      createMock<User>({
        email,
        status: Status.Disabled,
        checkPassword: jest.fn().mockResolvedValue(true),
      }),
    );

    await expect(service.login(email, password)).rejects.toThrowError(
      'Invalid credentials',
    );
  });

  it('should verify the JWT payload', async () => {
    const payload: JwtPayload = {
      sub: '',
      iat: 0,
      exp: 0,
      id: 1,
      email: 'john@doe.me',
      name: 'john',
      roles: ['user'],
    };

    mockedUserService.findOne.mockResolvedValueOnce(
      createMock<User>({ email: payload.sub, status: Status.Enabled }),
    );
    const user = await service.verifyPayload(payload);

    expect(user).toHaveProperty('email', payload.sub);
  });

  it("should throw on verify when JWT's subject not exist", async () => {
    const payload: JwtPayload = {
      sub: '',
      iat: 0,
      exp: 0,
      id: 1,
      email: 'notregistered@example.com',
      name: 'notregistered',
      roles: ['user'],
    };

    mockedUserService.findOne.mockRejectedValueOnce('NotFound');

    await expect(
      service.verifyPayload(payload),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Unauthorized"`);
  });

  it('should reject disabled users when verifying JWT payload', async () => {
    const payload: JwtPayload = {
      sub: '',
      iat: 0,
      exp: 0,
      id: 1,
      email: 'disabled@example.com',
      name: 'disabled',
      roles: ['user'],
    };

    mockedUserService.findOne.mockResolvedValueOnce(
      createMock<User>({ email: payload.email, status: Status.Disabled }),
    );

    await expect(service.verifyPayload(payload)).rejects.toThrowError(
      'Unauthorized',
    );
  });

  it('should sign a new JWT', () => {
    const user = createMock<User>({ email: 'john@doe.me' });

    mockedJwtService.sign.mockReturnValueOnce('j.w.t');
    const token = service.signToken(user);

    expect(token).toEqual(expect.any(String));
  });
});
