import { ConnectionOptions } from 'typeorm'
import { IPostgresCredentials } from './interfaces'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'

const rootPath = __dirname.split('/app')[0]

export class DatabasesService {

  public static getPostgresConnectionOptions(envConfiguration: IEnvConfiguration): ConnectionOptions {

    const postgresCredentials: IPostgresCredentials =
      DatabasesService.getPostgresCredentials(envConfiguration)

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

  private static getPostgresCredentials(envConfiguration: IEnvConfiguration): IPostgresCredentials {

    const {
      postgresHost, postgresPort, postgresUser, postgresPass, postgresDbName
    } = envConfiguration

    if (!postgresHost) {
      throw Error
    }

    if (!postgresPort) {
      throw Error
    }

    if (!postgresUser) {
      throw Error
    }

    if (!postgresPass) {
      throw Error
    }

    if (!postgresDbName) {
      throw Error
    }

    // TODO FIX THIS VERY VERY VERY BAD CHECK

    return {
      host: postgresHost,
      port: postgresPort,
      username: postgresUser,
      password: postgresPass,
      database: postgresDbName
    }
  }
}
