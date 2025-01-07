import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';

import { UserController } from './user.controller';
import { UserService } from '@modules/user/services/user.service';
import { Role } from '@modules/user/enums/role.enum';
import { Status } from '@modules/user/enums/status.enum';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [Logger],
    })
      .useMocker((token) => {
        const findAll = async () => ({
          data: [
            {
              id: 2,
              email: 'jane@doe.me',
              name: 'Jane Doe',
              role: 'user',
              status: 'enabled',
            },
            {
              id: 1,
              email: 'john@doe.me',
              name: 'John Doe',
              role: 'user',
              status: 'enabled',
            },
          ],
          meta: {
            itemsPerPage: 20,
            totalItems: 2,
            currentPage: 1,
            totalPages: 1,
            sortBy: [['id', 'DESC']],
          },
          links: {
            current:
              'http://localhost:3000/users?page=1&limit=20&sortBy=id:DESC',
          },
        });
        const findUser = async () => ({
          id: 1,
          email: 'john@doe.me',
          name: 'John Doe',
          role: 'user',
          status: 'enabled',
          createdAt: '2025-01-00:00:00.000Z',
          updatedAt: '2025-01-00:00:00.000Z',
        });
        const updateUser = async () => ({
          id: 1,
          email: 'john@doe.me',
          name: 'John Doe 123',
          role: 'user',
          status: 'enabled',
          createdAt: '2025-01-00:00:00.000Z',
          updatedAt: '2025-01-00:00:00.000Z',
        });
        const deleteUser = async () => ({
          id: 1,
          email: 'john@doe.me',
          name: 'John Doe',
          role: 'user',
          status: 'disabled',
          createdAt: '2025-01-00:00:00.000Z',
          updatedAt: '2025-01-00:00:00.000Z',
        });
        if (Object.is(token, UserService)) {
          return createMock<UserService>({
            findAll: jest.fn().mockImplementation(findAll),
            findUser: jest.fn().mockImplementation(findUser),
            updateUser: jest.fn().mockImplementation(updateUser),
            deleteUser: jest.fn().mockImplementation(deleteUser),
          });
        }
      })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', async () => {
    await expect(
      controller.findAll({ path: 'http://localhost:3000/users' }),
    ).resolves.toEqual({
      data: [
        {
          id: 2,
          email: 'jane@doe.me',
          name: 'Jane Doe',
          role: 'user',
          status: 'enabled',
        },
        {
          id: 1,
          email: 'john@doe.me',
          name: 'John Doe',
          role: 'user',
          status: 'enabled',
        },
      ],
      meta: {
        itemsPerPage: 20,
        totalItems: 2,
        currentPage: 1,
        totalPages: 1,
        sortBy: [['id', 'DESC']],
      },
      links: {
        current: 'http://localhost:3000/users?page=1&limit=20&sortBy=id:DESC',
      },
    });
  });

  it('should find one user', async () => {
    await expect(controller.findOne(1)).resolves.toEqual({
      id: 1,
      email: 'john@doe.me',
      name: 'John Doe',
      role: 'user',
      status: 'enabled',
      createdAt: '2025-01-00:00:00.000Z',
      updatedAt: '2025-01-00:00:00.000Z',
    });
  });

  it('should update user', async () => {
    await expect(
      controller.update(1, {
        name: 'John Doe 123',
        role: Role.User,
        status: Status.Enabled,
      }),
    ).resolves.toEqual({
      id: 1,
      email: 'john@doe.me',
      name: 'John Doe 123',
      role: 'user',
      status: 'enabled',
      createdAt: '2025-01-00:00:00.000Z',
      updatedAt: '2025-01-00:00:00.000Z',
    });
  });

  it('should delete user', async () => {
    await expect(controller.delete(1)).resolves.toEqual({
      id: 1,
      email: 'john@doe.me',
      name: 'John Doe',
      role: 'user',
      status: 'disabled',
      createdAt: '2025-01-00:00:00.000Z',
      updatedAt: '2025-01-00:00:00.000Z',
    });
  });
});
