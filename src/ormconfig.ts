import { ConnectionOptions } from 'typeorm';

import { SnakeNamingStrategy } from '@shared/snake-naming.strategy';
import '@shared/boilerplate.polyfill';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/entities/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsRun: false,
  logging: false,
  synchronize: true,
};

export default config;
