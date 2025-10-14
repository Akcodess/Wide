import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { baseTenantDataSourceOptions } from './database.config';

@Injectable()
export class TenantConnectionService {
  private readonly connections: Map<string, DataSource> = new Map();

  private buildOptions(tenantCode: string): DataSourceOptions {
    return {
      ...baseTenantDataSourceOptions,
      database: `${process.env.DB_DATABASE}_${tenantCode}`,
      name: `${process.env.DB_DATABASE}_${tenantCode}`,
      entities: baseTenantDataSourceOptions.entities as any,
      synchronize: false,
    } as DataSourceOptions;
  }

  private async createDatabaseIfNotExists(tenantCode: string): Promise<void> {
    const tempOptions: DataSourceOptions = {
      ...baseTenantDataSourceOptions,
      database: process.env.DIALECT,
      name: `admin_${tenantCode}_${Date.now()}`,
      entities: [],
      synchronize: true,
    } as DataSourceOptions;

    const admin = new DataSource(tempOptions);
    try {
      await admin.initialize();
      await admin.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}_${tenantCode}\``);
    } finally {
      if (admin.isInitialized) {
        await admin.destroy();
      }
    }
  }

  async ensureTenant(tenantCode: string): Promise<DataSource> {
    const key = `${process.env.DB_DATABASE}_${tenantCode}`;
    const existing = this.connections.get(key);
    if (existing?.isInitialized) return existing;

    await this.createDatabaseIfNotExists(tenantCode);

    const dataSource = new DataSource(this.buildOptions(tenantCode));
    await dataSource.initialize();
    this.connections.set(key, dataSource);
    return dataSource;
  }

  async getDataSource(tenantCode: string): Promise<DataSource> {
    const key = `${process.env.DB_DATABASE}_${tenantCode}`;
    const ds = this.connections.get(key);
    if (ds?.isInitialized) return ds;
    return this.ensureTenant(tenantCode);
  }

  async getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>, tenantCode: string): Promise<Repository<T>> {
    const ds = await this.getDataSource(tenantCode);
    return ds.getRepository<T>(entity);
  }
}


