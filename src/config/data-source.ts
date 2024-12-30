import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { User } from '@modules/user/entities/user.entity';
import { userFactory } from '@modules/user/factories/user.factory';
import { UserSeeder } from '@modules/user/testing/user.seeder';
import { CreateUser1557166726050 } from '@modules/user/migrations/1557166726050-CreateUser';

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User],
  migrations: [CreateUser1557166726050],
  factories: [userFactory],
  seeds: [UserSeeder],
  extra: {
    ssl:
      process.env.SSL_MODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
};

export const appDataSource = new DataSource(dataSourceOptions);
