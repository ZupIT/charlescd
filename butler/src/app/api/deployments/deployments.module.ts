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
  Module
} from '@nestjs/common'
import { DeploymentsController } from './controller'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity,
  UndeploymentEntity,
  QueuedIstioDeploymentEntity
} from './entity'
import { ModuleEntity } from '../modules/entity'
import { ComponentEntity } from '../components/entity'
import { LogsModule } from '../../core/logs/logs.module'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository,
  QueuedIstioDeploymentsRepository
} from './repository'
import {
  DeploymentsService,
  PipelineDeploymentsService,
  PipelineErrorHandlerService,
  PipelineQueuesService
} from './services'
import {
  CreateCircleDeploymentRequestUsecase,
  CreateDefaultDeploymentRequestUsecase,
  CreateUndeploymentRequestUsecase
} from './use-cases'
import { ServicesModule } from '../../core/services/services.module'
import { DeploymentUniquenessPipe } from './pipes'
import { CdConfigurationsRepository } from '../configurations/repository'
import { ModulesService } from './services/modules.service'
import { UndeploymentsController } from './controller/undeployments.controller';

@Module({
  imports: [
    forwardRef(() => IntegrationsModule),
    LogsModule,
    ServicesModule,
    TypeOrmModule.forFeature([
      DeploymentEntity,
      ModuleDeploymentEntity,
      ComponentDeploymentEntity,
      ModuleEntity,
      ComponentEntity,
      QueuedDeploymentEntity,
      ComponentDeploymentsRepository,
      QueuedDeploymentsRepository,
      QueuedUndeploymentEntity,
      UndeploymentEntity,
      ComponentUndeploymentsRepository,
      CdConfigurationsRepository,
      QueuedIstioDeploymentsRepository,
      QueuedIstioDeploymentEntity
    ])
  ],
  controllers: [
    DeploymentsController, UndeploymentsController
  ],
  providers: [
    DeploymentsService,
    PipelineQueuesService,
    PipelineDeploymentsService,
    PipelineErrorHandlerService,
    CreateUndeploymentRequestUsecase,
    CreateCircleDeploymentRequestUsecase,
    CreateDefaultDeploymentRequestUsecase,
    DeploymentUniquenessPipe,
    ModulesService
  ],
  exports: [
    DeploymentsService,
    PipelineQueuesService,
    PipelineErrorHandlerService
  ]
})
export class DeploymentsModule {}
