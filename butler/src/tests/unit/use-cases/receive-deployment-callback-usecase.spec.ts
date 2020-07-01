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
import { ReceiveDeploymentCallbackUsecase } from '../../../app/api/notifications/use-cases'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
  ConsoleLoggerServiceStub,
  MooveServiceStub,
  PipelineErrorHandlerServiceStub,
  PipelineQueuesServiceStub,
  StatusManagementServiceStub
} from '../../stubs/services'
import { MooveService } from '../../../app/core/integrations/moove'
import { StatusManagementService } from '../../../app/core/services/deployments'
import {
  PipelineErrorHandlerService,
  PipelineQueuesService
} from '../../../app/api/deployments/services'
import {
  ComponentDeploymentsRepositoryStub,
  DeploymentsRepositoryStub,
  QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
  ComponentDeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { FinishDeploymentDto } from '../../../app/api/notifications/dto'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity,
  CircleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'

describe('ReceiveDeploymentCallbackUsecase', () => {

  let receiveDeploymentCallbackUsecase: ReceiveDeploymentCallbackUsecase
  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let successfulFinishDeploymentDto: FinishDeploymentDto
  let failedFinishDeploymentDto: FinishDeploymentDto
  let queuedDeployment: QueuedDeploymentEntity
  let queuedDeploymentFinished: QueuedDeploymentEntity
  let deployment: DeploymentEntity
  let moduleDeployment: ModuleDeploymentEntity
  let componentDeployment: ComponentDeploymentEntity
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let pipelineQueuesService: PipelineQueuesService
  let pipelineErrorHandlerService: PipelineErrorHandlerService
  beforeEach(async() => {

    const module = await Test.createTestingModule({
      providers: [
        ReceiveDeploymentCallbackUsecase,
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: MooveService, useClass: MooveServiceStub },
        { provide: StatusManagementService, useClass: StatusManagementServiceStub },
        { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
        { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
        { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
        { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
        { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub }
      ]
    }).compile()

    receiveDeploymentCallbackUsecase = module.get<ReceiveDeploymentCallbackUsecase>(ReceiveDeploymentCallbackUsecase)
    queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
    pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
    pipelineErrorHandlerService = module.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)
    componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
    successfulFinishDeploymentDto = new FinishDeploymentDto('SUCCEEDED')
    failedFinishDeploymentDto = new FinishDeploymentDto('FAILED')
    queuedDeployment = new QueuedDeploymentEntity(
      'dummy-component-id',
      'dummy-component-deployment-id',
      QueuedPipelineStatusEnum.RUNNING
    )
    queuedDeploymentFinished = new QueuedDeploymentEntity(
      'dummy-component-id',
      'dummy-component-deployment-id',
      QueuedPipelineStatusEnum.FINISHED
    )

    componentDeployment = new ComponentDeploymentEntity(
      'dummy-id',
      'dummy-name',
      'dummy-img-url',
      'dummy-img-tag'
    )

    moduleDeployment = new ModuleDeploymentEntity(
      'dummy-id',
      'dummy-id',
      [componentDeployment]
    )

    deployment = new DeploymentEntity(
      'dummy-deployment-id',
      'dummy-application-name',
      [moduleDeployment],
      'dummy-author-id',
      'dummy-description',
      'dummy-callback-url',
      null,
      false,
      'dummy-circle-id',
      'cd-configuration-id'
    )
    componentDeployment.moduleDeployment = moduleDeployment
    moduleDeployment.deployment = deployment
    deployment.circle = new CircleDeploymentEntity('header-value')
  })

  describe('execute', () => {
    it('should update successful callback queued entry status to FINISHED', async() => {

      jest.spyOn(queuedDeploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(queuedDeployment))
      jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentDeployment))

      const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedDeploymentStatusFinished')
      await receiveDeploymentCallbackUsecase.execute(
        1234,
        successfulFinishDeploymentDto
      )

      expect(queueSpy).toHaveBeenCalledWith(1234)
    })

    it('should not execute a finished deployment', async() => {

      jest.spyOn(queuedDeploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(queuedDeploymentFinished))
      jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentDeployment))
      const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedDeploymentStatusFinished')
      await receiveDeploymentCallbackUsecase.execute(
        1234,
        successfulFinishDeploymentDto
      )
      expect(queueSpy).not.toHaveBeenCalledWith(1234)
    })

    it('should handle a failed deployment callback', async() => {

      jest.spyOn(queuedDeploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(queuedDeployment))
      jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentDeployment))
      const queueSpy = jest.spyOn(pipelineErrorHandlerService, 'handleDeploymentFailure')
      const queueSpy1 = jest.spyOn(pipelineErrorHandlerService, 'handleComponentDeploymentFailure')
      await receiveDeploymentCallbackUsecase.execute(
        1234,
        failedFinishDeploymentDto
      )
      expect(queueSpy).toHaveBeenCalled()
      expect(queueSpy1).toHaveBeenCalled()
    })
  })
})
