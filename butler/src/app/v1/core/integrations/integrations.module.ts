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

import {
  forwardRef,
  HttpModule,
  Module
} from '@nestjs/common'
import { SpinnakerService } from './cd/spinnaker'
import { MooveService } from './moove'
import { LogsModule } from '../logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../api/deployments/entity'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../api/deployments/repository'
import { DatabasesService } from './databases'
import { ServicesModule } from '../services/services.module'
import { DeploymentsModule } from '../../api/deployments/deployments.module'
import { CdConfigurationsRepository } from '../../api/configurations/repository'
import { CdStrategyFactory } from './cd'
import { OctopipeService } from './cd/octopipe'
import { SpinnakerApiService } from './cd/spinnaker/spinnaker-api.service'
import { OctopipeApiService } from './cd/octopipe/octopipe-api.service'

@Module({
  imports: [
    HttpModule,
    LogsModule,
    ServicesModule,
    forwardRef(() => DeploymentsModule),
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository,
      DeploymentEntity,
      ModuleDeploymentEntity,
      QueuedDeploymentsRepository,
      ComponentUndeploymentsRepository,
      CdConfigurationsRepository
    ])
  ],
  providers: [
    SpinnakerService,
    OctopipeService,
    MooveService,
    DatabasesService,
    CdStrategyFactory,
    SpinnakerApiService,
    OctopipeApiService
  ],
  exports: [
    MooveService,
    DatabasesService,
    CdStrategyFactory
  ]
})
export class IntegrationsModule {}
