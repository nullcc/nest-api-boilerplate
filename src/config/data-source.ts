import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { createDataSourceOptions } from '@config/database';

loadEnv({
  path: `.env${process.env.APP_ENV ? '.' + process.env.APP_ENV : ''}`,
  override: false,
});

export const dataSourceOptions: DataSourceOptions & SeederOptions =
  createDataSourceOptions();

export const appDataSource = new DataSource(dataSourceOptions);
