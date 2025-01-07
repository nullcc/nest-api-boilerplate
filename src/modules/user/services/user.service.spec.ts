import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';

import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { Role } from '@modules/user/enums/role.enum';
import { Status } from '@modules/user/enums/status.enum';

describe('UserService', () => {
  let service: UserService;
  let mockedUserRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, Repository, Logger],
    })
      .useMocker((token) => {
        if (Object.is(token, getRepositoryToken(User))) {
          return createMock<Repository<User>>();
        }
      })
      .compile();

    service = module.get(UserService);
    mockedUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be an instanceof UserService', () => {
    expect(service).toBeInstanceOf(UserService);
  });

  it('should create a new user', async () => {
    const newUser: Partial<User> = {
      name: 'John Doe',
      email: 'john@doe.me',
      password: 'Pa$$w0rd',
      role: Role.User,
      status: Status.Enabled,
    };

    mockedUserRepository.create.mockReturnValue(createMock<User>(newUser));
    mockedUserRepository.save.mockResolvedValue(createMock<User>(newUser));
    const user = await service.create(newUser);

    expect(user).toHaveProperty('email', newUser.email);
    expect(user).toHaveProperty('name', newUser.name);
  });
});
