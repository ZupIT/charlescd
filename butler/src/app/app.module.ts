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
import IEnvConfiguration from './v2/core/configuration/interfaces/env-configuration.interface'
import { DatabasesService } from './v2/core/integrations/databases'
import { ApiModule as ApiModuleV2 } from './v2/api/api.module'
import { Configuration } from './v2/core/config/configurations'
import { AppConstants } from './v2/core/constants'
import { IoCTokensConstants } from './v2/core/constants/ioc'
import { CoreModule } from './v2/core/core.module'

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
        ApiModuleV2,
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
