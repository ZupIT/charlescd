/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { HttpModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MooveService } from '../../core/integrations/moove'
import { DeploymentsController } from './controller/deployments.controller'
import { DeploymentEntityV2 as DeploymentEntity } from './entity/deployment.entity'
import { Execution } from './entity/execution.entity'
import { ComponentsRepositoryV2 } from './repository'
import { CreateDeploymentUseCase } from './use-cases/create-deployment.usecase'
import { CreateUndeploymentUseCase } from './use-cases/create-undeployment.usecase'
import { DeploymentRepositoryV2 } from './repository/deployment.repository'
import { ExecutionRepository } from './repository/execution.repository'
import { ExecutionsController } from './controller/executions.controller'
import { PaginatedExecutionsUseCase } from './use-cases/paginated-executions.usecase'
import { HelmManifest } from '../../core/manifests/helm/helm-manifest'
import { GitHubRepository } from '../../core/integrations/github/github-repository'
import { GitLabRepository } from '../../core/integrations/gitlab/gitlab-repository'
import { RepositoryStrategyFactory } from '../../core/integrations/repository-strategy-factory'
import { K8sClient } from '../../core/integrations/k8s/client'
import { ConsoleLoggerService } from '../../core/logs/console/console-logger.service'
import { FindDeploymentLogsByIdUsecase } from './use-cases/find-deployment-logs-by-id.usecase'
import { LogRepository } from './repository/log.repository'

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      DeploymentEntity,
      Execution,
      ComponentsRepositoryV2,
      ExecutionRepository,
      DeploymentRepositoryV2,
      LogRepository
    ])
  ],
  controllers: [
    DeploymentsController,
    ExecutionsController
  ],
  providers: [
    CreateDeploymentUseCase,
    CreateUndeploymentUseCase,
    PaginatedExecutionsUseCase,
    FindDeploymentLogsByIdUsecase,
    MooveService,
    ConsoleLoggerService,
    GitHubRepository,
    GitLabRepository,
    RepositoryStrategyFactory,
    HelmManifest,
    K8sClient
  ],
  exports: [
  ]
})
export class DeploymentsModule { }
