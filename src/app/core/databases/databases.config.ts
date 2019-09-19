import { ConnectionOptions } from 'typeorm'

const rootPath = __dirname.split('/app')[0]

const postgresqlOptions: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'darwin',
  password: process.env.POSTGRES_PASS || 'darwin',
  database: process.env.POSTGRES_DB_NAME || 'darwin',
  entities: [`${rootPath}/app/**/**.entity{.ts,.js}`],
  migrationsTableName: 'darwin-deploy-migrations',
  migrations: [`${rootPath}/app/resources/migrations/*{.ts,.js}`]
}

export const databasesConfig = {
  postgresqlOptions
}
