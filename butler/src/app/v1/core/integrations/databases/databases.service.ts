/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
      migrations: [`${rootPath}/resources/migrations/*{.ts,.js}`],
      migrationsRun: true,
      synchronize: false,
    }
  }

  private static getPostgresCredentials(envConfiguration: IEnvConfiguration): IPostgresCredentials {

    const {
      postgresHost, postgresPort, postgresUser, postgresPass, postgresDbName, postgresSSL
    } = envConfiguration

    return {
      host: postgresHost,
      port: postgresPort,
      username: postgresUser,
      password: postgresPass,
      database: postgresDbName,
      ssl: postgresSSL,
    }
  }
}
