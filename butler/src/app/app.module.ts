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

import { DynamicModule, Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiModule } from './v1/api/api.module'
import { Configuration } from './v1/core/config/configurations'
import { AppConstants } from './v1/core/constants'
import { CoreModule } from './v1/core/core.module'
import IEnvConfiguration from './v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { DatabasesService } from './v1/core/integrations/databases'
import { IoCTokensConstants } from './v1/core/constants/ioc'

@Global()
@Module({})
export class AppModule {

  public static async forRootAsync(): Promise<DynamicModule> {

    return AppModule.getModuleObject(Configuration)
  }

  private static getModuleObject(envConfiguration: IEnvConfiguration): DynamicModule {

    return {
      module: AppModule,
      imports: [
        CoreModule,
        ApiModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => (
            DatabasesService.getPostgresConnectionOptions(envConfiguration)
          )
        })
      ],
      providers: [{
        provide: IoCTokensConstants.ENV_CONFIGURATION,
        useValue: AppConstants.Configuration
      }],
      exports: [ IoCTokensConstants.ENV_CONFIGURATION]
    }
  }
}
