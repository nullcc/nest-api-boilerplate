import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';

export const dataSourceOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: true,
  autoLoadEntities: true,
  extra: {
    ssl:
      process.env.SSL_MODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
};
