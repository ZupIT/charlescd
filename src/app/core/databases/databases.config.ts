import { ConnectionOptions } from 'typeorm'

const postgresqlOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'darwin',
  password: 'darwin',
  database: 'darwin',
  entities: ['src/**/*.entity.ts'],
  migrationsTableName: 'darwin-deploy-migrations',
  migrations: ['src/app/resources/migrations/*.ts'],
  synchronize: true
}

export const databasesConfig = {
  postgresqlOptions
}
