import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from '../entities/user.entity';
import { users } from './user.fixtures';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.manager.upsert(User, users, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
    });
  }
}
