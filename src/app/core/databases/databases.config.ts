import { ConnectionOptions } from 'typeorm'

const rootPath = __dirname.split('/app')[0]

const postgresqlOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'darwin-database.gcp.zup.com.br',
  port: 5432,
  username: 'darwindeploy',
  password: 'acelera',
  database: 'darwindeploy',
  entities: [`${rootPath}/app/**/**.entity{.ts,.js}`],
  migrationsTableName: 'darwin-deploy-migrations',
  migrations: [`${rootPath}/app/resources/migrations/*{.ts,.js}`],
  migrationsRun: true,
  synchronize: false
}

export const databasesConfig = {
  postgresqlOptions
}
