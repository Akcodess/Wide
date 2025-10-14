import { DataSourceOptions } from 'typeorm';

export const baseTenantDataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_DIALECT as any) || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  // database is set per-tenant dynamically
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};



