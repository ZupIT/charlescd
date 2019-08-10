import { ConnectionOptions } from 'typeorm'

const postgresqlOptions: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'darwin',
  password: process.env.POSTGRES_PASS || 'darwin',
  database: process.env.POSTGRES_DB_NAME || 'darwin',
  entities: ['src/**/*.entity.ts'],
  migrationsTableName: 'darwin-deploy-migrations',
  migrations: ['src/app/resources/migrations/*.ts'],
  synchronize: true
}

export const databasesConfig = {
  postgresqlOptions
}
