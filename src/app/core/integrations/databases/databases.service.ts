import { ConnectionOptions } from 'typeorm'
import { IPostgresCredentials } from './interfaces'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'

const rootPath = __dirname.split('/app')[0]

export class DatabasesService {

  public static getPostgresConnectionOptions(consulConfiguration: IEnvConfiguration): ConnectionOptions {

    const postgresCredentials: IPostgresCredentials =
      DatabasesService.getPostgresCredentials(consulConfiguration)

    return {
      type: 'postgres',
      ...postgresCredentials,
      entities: [`${rootPath}/app/**/**.entity{.ts,.js}`],
      migrationsTableName: 'darwin-deploy-migrations',
      migrations: [`${rootPath}/app/resources/migrations/*{.ts,.js}`],
      migrationsRun: true,
      synchronize: false
    }
  }

  private static getPostgresCredentials(consulConfiguration: IEnvConfiguration): IPostgresCredentials {

    const {
      postgresHost, postgresPort, postgresUser, postgresPass, postgresDbName
    } = consulConfiguration

    return {
      host: postgresHost,
      port: postgresPort,
      username: postgresUser,
      password: postgresPass,
      database: postgresDbName
    }
  }
}
