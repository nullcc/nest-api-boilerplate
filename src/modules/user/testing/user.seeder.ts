import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { User } from '../entities/user.entity';
import { users } from './user.fixtures';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.upsert(User, users, {
      conflictPaths: ['id'],
      upsertType: 'on-conflict-do-update',
    });
  }
}
