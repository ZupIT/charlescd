import { ConnectionOptions } from 'typeorm'
import { ConsulService } from '../integrations/consul'
import { AppConstants } from '../constants'
import { IPostgresCredentials } from './interfaces'

const rootPath = __dirname.split('/app')[0]

export class DatabasesService {

  public static async getPostgresConnectionOptions(): Promise<ConnectionOptions> {

    const postgresCredentials: IPostgresCredentials = process.env.NODE_ENV === 'dev' ?
      await DatabasesService.getLocalPostgresCredentials() :
      await DatabasesService.getConsulPostgresCredentials()

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

  private static async getConsulPostgresCredentials(): Promise<IPostgresCredentials> {

    const {
      postgresHost, postgresPort, postgresUser, postgresPass, postgresDbName
    } = await ConsulService.getKV(AppConstants.CONSUL_KEY_PATH)

    return {
      host: postgresHost,
      port: postgresPort,
      username: postgresUser,
      password: postgresPass,
      database: postgresDbName
    }
  }

  private static getLocalPostgresCredentials(): IPostgresCredentials {

    return {
      host: 'localhost',
      port: 5432,
      username: 'darwin',
      password: 'darwin',
      database: 'darwin'
    }
  }
}
