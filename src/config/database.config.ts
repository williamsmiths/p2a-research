import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const hasSlave = Boolean(process.env.DB_SLAVE_HOST);

    const baseConfig = {
      type: 'postgres' as const,
      entities: [],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      extra: {
        timezone: 'UTC',
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    };

    if (hasSlave) {
      return {
        ...baseConfig,
        replication: {
          master: {
            host: process.env.DB_MASTER_HOST,
            port: parseInt(process.env.DB_MASTER_PORT || '5432', 10),
            username: process.env.DB_MASTER_USERNAME,
            password: process.env.DB_MASTER_PASSWORD,
            database: process.env.DB_MASTER_DATABASE,
          },
          slaves: [
            {
              host: process.env.DB_SLAVE_HOST,
              port: parseInt(process.env.DB_SLAVE_PORT || '5432', 10),
              username: process.env.DB_SLAVE_USERNAME,
              password: process.env.DB_SLAVE_PASSWORD,
              database: process.env.DB_SLAVE_DATABASE,
            },
          ],
        },
      } as TypeOrmModuleOptions;
    }

    return {
      ...baseConfig,
      host: process.env.DB_MASTER_HOST,
      port: parseInt(process.env.DB_MASTER_PORT || '5432', 10),
      username: process.env.DB_MASTER_USERNAME,
      password: process.env.DB_MASTER_PASSWORD,
      database: process.env.DB_MASTER_DATABASE,
    } as TypeOrmModuleOptions;
  },
);


