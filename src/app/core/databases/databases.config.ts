import { ConnectionOptions } from 'typeorm'
import { ConsulService } from '../integrations/consul'
import { AppConstants } from '../constants'

const rootPath = __dirname.split('/app')[0]

export class DatabasesConfig {

  public static async getPostgresqlConnectionOptions(): Promise<ConnectionOptions> {

    const {
      postgresHost, postgresPort, postgresUser, postgresPass, postgresDbName
    } = await ConsulService.getKV(AppConstants.CONSUL_KEY_PATH)

    return {
      type: 'postgres',
      host: postgresHost,
      port: postgresPort,
      username: postgresUser,
      password: postgresPass,
      database: postgresDbName,
      entities: [`${rootPath}/app/**/**.entity{.ts,.js}`],
      migrationsTableName: 'darwin-deploy-migrations',
      migrations: [`${rootPath}/app/resources/migrations/*{.ts,.js}`],
      migrationsRun: true,
      synchronize: false
    }
  }
}
