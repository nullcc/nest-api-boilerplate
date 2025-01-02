import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { userFactory } from '@modules/user/testing/user.factory';
import UserSeeder from '@modules/user/testing/user.seeder';
import { User } from "@modules/user/entities/user.entity";

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
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
