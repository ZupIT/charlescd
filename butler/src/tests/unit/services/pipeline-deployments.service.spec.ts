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

import { Test } from '@nestjs/testing'
import { ComponentEntity } from '../../../app/v1/api/components/entity'
import { CdConfigurationsRepository } from '../../../app/v1/api/configurations/repository'
import {
  CircleDeploymentEntity, ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity
} from '../../../app/v1/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/v1/api/deployments/enums'
import { ComponentUndeploymentsRepository } from '../../../app/v1/api/deployments/repository'
import { PipelineDeploymentsService, PipelineErrorHandlerService } from '../../../app/v1/api/deployments/services'
import { IoCTokensConstants } from '../../../app/v1/core/constants/ioc'
import { CdStrategyFactory } from '../../../app/v1/core/integrations/cd'
import { ConsoleLoggerService } from '../../../app/v1/core/logs/console'
import { EnvConfigurationStub } from '../../stubs/configurations'
import { CdStrategyFactoryStub } from '../../stubs/integrations/cd-strategy.factory.stub'
import { CdConfigurationsRepositoryStub, ComponentsRepositoryStub, ComponentUndeploymentsRepositoryStub } from '../../stubs/repository'
import { ConsoleLoggerServiceStub, PipelineErrorHandlerServiceStub } from '../../stubs/services'
import { ModuleEntity } from '../../../app/v1/api/modules/entity'

describe('Pipeline Deployments Service', () => {
  let pipelineDeploymentsService: PipelineDeploymentsService
  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        PipelineDeploymentsService,
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
        { provide: CdStrategyFactory, useClass: CdStrategyFactoryStub },
        { provide: IoCTokensConstants.ENV_CONFIGURATION, useValue: EnvConfigurationStub },
        { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
        { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
        { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub }
      ]
    }).compile()

    pipelineDeploymentsService = module.get<PipelineDeploymentsService>(PipelineDeploymentsService)
  })

  it('triggers deployment without error', async() => {
    const moduleEntity = new ModuleEntity(
      'module-id',
      []
    )
    const componentEntity = new ComponentEntity('component-id', undefined, undefined)
    componentEntity.module = moduleEntity

    const componentDeployment = new ComponentDeploymentEntity(
      'dummy-id',
      'dummy-name',
      'dummy-img-url',
      'dummy-img-tag'
    )

    const moduleDeployment = new ModuleDeploymentEntity(
      'dummy-id',
      'helm-repository',
      [componentDeployment]
    )

    const circle = new CircleDeploymentEntity('header-value')

    const deploymentEntity = new DeploymentEntity(
      'deployment-id',
      'application-name',
      [moduleDeployment],
      'author-id',
      'description',
      'callback-url',
      circle,
      false,
      'incoming-circle-id',
      'cd-configuration-id'
    )
    moduleDeployment.deployment = deploymentEntity
    componentDeployment.moduleDeployment = moduleDeployment

    const queuedDeploymentEntity = new QueuedDeploymentEntity(
      'dummy-component-id',
      'dummy-component-deployment-id3',
      QueuedPipelineStatusEnum.QUEUED,
    )

    await expect(
      pipelineDeploymentsService.triggerCircleDeployment(componentDeployment, componentEntity, deploymentEntity, queuedDeploymentEntity, circle)
    ).resolves.not.toThrow()
  })
})
