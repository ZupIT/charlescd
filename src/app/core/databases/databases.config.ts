import { ConnectionOptions } from 'typeorm'

const postgresqlOptions: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'darwin',
  password: process.env.POSTGRES_PASS || 'darwin',
  database: process.env.POSTGRES_DB_NAME || 'darwin',
  entities: [
    "app/api/**/entity/*.js"
  ],
  migrationsTableName: 'darwin-deploy-migrations',
  migrations: ['app/resources/migrations/*.js'],
  synchronize: true
}

export const databasesConfig = {
  postgresqlOptions
}
