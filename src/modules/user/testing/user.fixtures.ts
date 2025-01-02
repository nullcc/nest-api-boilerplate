import { User } from '@modules/user/entities/user.entity';

export const users: Partial<User>[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@doe.me',
    password: '$2a$10$/fYiP2xeHZmTDRrT6VYOueMjqlYsypCpYp9hEztSnEXhhZgxnZ62G', // 12345678
    createdAt: new Date('2024-12-30 00:00:00'),
    updatedAt: new Date('2024-12-30 00:00:00'),
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@doe.me',
    password: '$2a$10$/fYiP2xeHZmTDRrT6VYOueMjqlYsypCpYp9hEztSnEXhhZgxnZ62G', // 12345678
    createdAt: new Date('2024-12-30 00:00:00'),
    updatedAt: new Date('2024-12-30 00:00:00'),
  },
];
