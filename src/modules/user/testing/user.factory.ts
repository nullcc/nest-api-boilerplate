import { setSeederFactory } from 'typeorm-extension';

import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';

export const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = 'Pa$$w0rd';
  user.role = Role.User;
  user.status = Status.Enabled;

  return user;
});
