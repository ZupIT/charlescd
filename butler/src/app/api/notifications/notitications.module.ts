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

import { Module } from '@nestjs/common'
import { NotificationsController } from './controller'
import { DeploymentsModule } from '../deployments/deployments.module'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { LogsModule } from '../../core/logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  QueuedDeploymentEntity,
  QueuedIstioDeploymentEntity
} from '../deployments/entity'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../deployments/repository'
import {
  ReceiveDeploymentCallbackUsecase,
  ReceiveUndeploymentCallbackUsecase,
} from './use-cases'
import { ServicesModule } from '../../core/services/services.module'
import { QueuedUndeploymentEntity } from '../deployments/entity/queued-undeployment.entity'
import { ReceiveIstioDeploymentCallbackUsecase } from './use-cases/receive-istio-deployment-callback.usecase'
import { QueuedIstioDeploymentsRepository } from '../deployments/repository/queued-istio-deployments.repository'

@Module({
  imports: [
    DeploymentsModule,
    IntegrationsModule,
    LogsModule,
    ServicesModule,
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository,
      DeploymentEntity,
      QueuedDeploymentEntity,
      QueuedDeploymentsRepository,
      ComponentUndeploymentEntity,
      ComponentUndeploymentsRepository,
      QueuedUndeploymentEntity,
      QueuedIstioDeploymentEntity,
      QueuedIstioDeploymentsRepository,
    ])
  ],
  controllers: [
    NotificationsController
  ],
  providers: [
    ReceiveDeploymentCallbackUsecase,
    ReceiveUndeploymentCallbackUsecase,
    ReceiveIstioDeploymentCallbackUsecase
  ]
})
export class NotificationsModule {}
