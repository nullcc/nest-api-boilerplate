import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from '../entities/user.entity';
import { users } from './user.fixtures';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(User);
    await repository.insert(users);

    // save entities defined by fixture file
    const userFactory = factoryManager.get(User);
    for (const user of users) {
      await userFactory.save(user);
    }

    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}
