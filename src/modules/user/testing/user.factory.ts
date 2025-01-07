import { setSeederFactory } from 'typeorm-extension';

import { User } from '@modules/user/entities/user.entity';
import { Role } from '@modules/user/enums/role.enum';
import { Status } from '@modules/user/enums/status.enum';

export const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = 'Pa$$w0rd';
  user.role = Role.User;
  user.status = Status.Enabled;

  return user;
});
