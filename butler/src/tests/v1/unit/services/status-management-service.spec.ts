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
import {
  ComponentDeploymentsRepositoryStub,
  ComponentUndeploymentsRepositoryStub,
  DeploymentsRepositoryStub,
  ModuleDeploymentsRepositoryStub,
  ModuleUndeploymentsRepositoryStub,
  UndeploymentsRepositoryStub,
  QueuedIstioDeploymentsRepositoryStub
} from '../../stubs/repository'
import { StatusManagementService } from '../../../../app/v1/core/services/deployments'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  ModuleUndeploymentEntity,
  UndeploymentEntity
} from '../../../../app/v1/api/deployments/entity'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedIstioDeploymentsRepository
} from '../../../../app/v1/api/deployments/repository'
import { Repository } from 'typeorm'
import {
  DeploymentStatusEnum,
  UndeploymentStatusEnum
} from '../../../../app/v1/api/deployments/enums'
import { DeploymentsRepository } from '../../../../app/v1/api/deployments/repository/deployments.repository'
import { ModuleDeploymentsRepository } from '../../../../app/v1/api/deployments/repository/module-deployments.repository'
import { ModuleUndeploymentsRepository } from '../../../../app/v1/api/deployments/repository/module-undeployments.repository'
import { UndeploymentsRepository } from '../../../../app/v1/api/deployments/repository/undeployments.repository'
import { ConsoleLoggerService } from '../../../../app/v1/core/logs/console'
import { ConsoleLoggerServiceStub } from '../../stubs/services'

describe('PipelinesService', () => {

  let statusManagementService: StatusManagementService
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let componentUndeploymentsRepository: ComponentUndeploymentsRepository
  let moduleDeploymentsRepository: Repository<ModuleDeploymentEntity>
  let moduleUndeploymentsRepository: ModuleUndeploymentsRepository
  let deploymentsRepository: Repository<DeploymentEntity>
  let undeploymentsRepository: Repository<UndeploymentEntity>
  let deployment: DeploymentEntity
  let deploymentWithRelations: DeploymentEntity
  let moduleDeployment: ModuleDeploymentEntity
  let moduleDeploymentWithRelations: ModuleDeploymentEntity
  let moduleDeploymentsList: ModuleDeploymentEntity[]
  let componentDeployment: ComponentDeploymentEntity
  let componentDeploymentsList: ComponentDeploymentEntity[]
  let circle: CircleDeploymentEntity
  let undeployment: UndeploymentEntity
  let moduleUndeployment: ModuleUndeploymentEntity
  let componentUndeployment: ComponentUndeploymentEntity
  let componentUndeploymentsList: ComponentUndeploymentEntity[]
  let moduleUndeploymentWithRelations: ModuleUndeploymentEntity

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      providers: [
        StatusManagementService,
        { provide: DeploymentsRepository, useClass: DeploymentsRepositoryStub },
        { provide: ModuleDeploymentsRepository, useClass: ModuleDeploymentsRepositoryStub },
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
        { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
        { provide: ModuleUndeploymentsRepository, useClass: ModuleUndeploymentsRepositoryStub },
        { provide: UndeploymentsRepository, useClass: UndeploymentsRepositoryStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: QueuedIstioDeploymentsRepository, useClass: QueuedIstioDeploymentsRepositoryStub }
      ]
    }).compile()

    statusManagementService = module.get<StatusManagementService>(StatusManagementService)
    componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
    componentUndeploymentsRepository = module.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)
    moduleUndeploymentsRepository = module.get<ModuleUndeploymentsRepository>(ModuleUndeploymentsRepository)
    deploymentsRepository = module.get<Repository<DeploymentEntity>>(DeploymentsRepository)
    undeploymentsRepository = module.get<Repository<UndeploymentEntity>>(UndeploymentsRepository)
    moduleDeploymentsRepository = module.get<Repository<ModuleDeploymentEntity>>(ModuleDeploymentsRepository)

    circle = new CircleDeploymentEntity('dummy-circle')

    componentDeployment = new ComponentDeploymentEntity(
      'dummy-id',
      'dummy-name',
      'dummy-img-url',
      'dummy-img-tag'
    )

    moduleDeployment = new ModuleDeploymentEntity(
      'dummy-id',
      'helm-repository',
      [componentDeployment]
    )

    deployment = new DeploymentEntity(
      'dummy-deployment-id',
      'dummy-application-name',
      [moduleDeployment],
      'dummy-author-id',
      'dummy-description',
      'dummy-callback-url',
      circle,
      false,
      'dummy-circle-id',
      'cd-configuration-id'
    )

    moduleDeployment.deployment = deployment

    componentDeployment.moduleDeployment = moduleDeployment

    componentDeploymentsList = [
      new ComponentDeploymentEntity(
        'dummy-id',
        'dummy-name',
        'dummy-img-url',
        'dummy-img-tag'
      ),
      new ComponentDeploymentEntity(
        'dummy-id',
        'dummy-name',
        'dummy-img-url',
        'dummy-img-tag'
      )
    ]

    moduleDeployment.components = componentDeploymentsList

    moduleDeploymentWithRelations = new ModuleDeploymentEntity(
      'dummy-id',
      'helm-repository',
      componentDeploymentsList
    )

    moduleDeploymentsList = [
      moduleDeploymentWithRelations
    ]

    deploymentWithRelations = new DeploymentEntity(
      'dummy-deployment-id',
      'dummy-application-name',
      moduleDeploymentsList,
      'dummy-author-id',
      'dummy-description',
      'dummy-callback-url',
      circle,
      false,
      'dummy-circle-id',
      'cd-configuration-id'
    )

    undeployment = new UndeploymentEntity(
      'dummy-author-id',
      deploymentWithRelations,
      'dummy-circle-id'
    )

    componentUndeployment = new ComponentUndeploymentEntity(
      componentDeployment
    )

    moduleUndeployment = new ModuleUndeploymentEntity(
      moduleDeployment,
      [componentUndeployment]
    )
    moduleUndeployment.undeployment = undeployment

    componentUndeployment.moduleUndeployment = moduleUndeployment

    componentUndeploymentsList = [
      componentUndeployment,
      componentUndeployment
    ]

    moduleUndeploymentWithRelations = new ModuleUndeploymentEntity(
      moduleDeployment,
      componentUndeploymentsList
    )

    undeployment.moduleUndeployments = [moduleUndeploymentWithRelations]

  })

  describe('setComponentDeploymentStatusAsFinished', () => {
    it('should correctly update component deployment status to SUCCEEDED', async() => {
      jest.spyOn(global, 'Date')
        .mockImplementation(() => '2020-04-20T19:16:46.700Z')
      jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentDeployment))
      jest.spyOn(moduleDeploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(moduleDeploymentWithRelations))
      jest.spyOn(deploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(deploymentWithRelations))

      const queueSpy = jest.spyOn(componentDeploymentsRepository, 'updateStatus')
      await statusManagementService.setComponentDeploymentStatusAsFinished(
        'dummy-component-deployment-id'
      )

      expect(queueSpy).toHaveBeenCalledWith('dummy-component-deployment-id', DeploymentStatusEnum.SUCCEEDED)
    })
  })

  describe('setComponentDeploymentStatusAsFailed', () => {
    it('should correctly update component deployment status to FAILED', async() => {

      jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentDeployment))
      jest.spyOn(moduleDeploymentsRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(moduleDeploymentWithRelations))
      jest.spyOn(deploymentsRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(deploymentWithRelations))

      const queueSpy = jest.spyOn(componentDeploymentsRepository, 'updateStatus')
      await statusManagementService.setComponentDeploymentStatusAsFailed(
        'dummy-component-deployment-id'
      )

      expect(queueSpy).toHaveBeenCalledWith('dummy-component-deployment-id', DeploymentStatusEnum.FAILED)
    })
  })

  describe('setComponentUndeploymentStatusAsFinished', () => {
    it('should correctly update component undeployment status to SUCCEEDED', async() => {

      jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentUndeployment))
      jest.spyOn(moduleUndeploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(moduleUndeploymentWithRelations))
      jest.spyOn(undeploymentsRepository, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(undeployment))

      const queueSpy = jest.spyOn(componentUndeploymentsRepository, 'updateStatus')
      await statusManagementService.setComponentUndeploymentStatusAsFinished(
        'dummy-component-undeployment-id'
      )
      expect(queueSpy).toHaveBeenCalledWith('dummy-component-undeployment-id', UndeploymentStatusEnum.SUCCEEDED)
    })
  })

  describe('setComponentUndeploymentStatusAsFailed', () => {
    it('should correctly update component undeployment status to FAILED', async() => {

      jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentUndeployment))
      jest.spyOn(moduleUndeploymentsRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(moduleUndeploymentWithRelations))
      jest.spyOn(undeploymentsRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(undeployment))

      const queueSpy = jest.spyOn(componentUndeploymentsRepository, 'updateStatus')
      await statusManagementService.setComponentUndeploymentStatusAsFailed(
        'dummy-component-undeployment-id'
      )

      expect(queueSpy).toHaveBeenCalledWith('dummy-component-undeployment-id', UndeploymentStatusEnum.FAILED)
    })
  })

  describe('deepUpdateModuleUndeploymentStatus', () => {
    it('should correctly update module undeployment and component undeployment status to FAILED', async() => {

      jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
        .mockImplementation(() => Promise.resolve(componentUndeployment))
      jest.spyOn(moduleUndeploymentsRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(moduleUndeploymentWithRelations))
      jest.spyOn(undeploymentsRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(undeployment))

      const queueSpy = jest.spyOn(componentUndeploymentsRepository, 'updateStatus')
      const queueSpy2 = jest.spyOn(moduleUndeploymentsRepository, 'updateStatus')
      await statusManagementService.deepUpdateModuleUndeploymentStatus(
        moduleUndeployment, UndeploymentStatusEnum.FAILED
      )

      expect(queueSpy).toHaveBeenCalledWith(componentUndeployment.id, UndeploymentStatusEnum.FAILED)
      expect(queueSpy).toBeCalledTimes(1)
      expect(queueSpy2).toBeCalledTimes(1)
      expect(queueSpy2).toHaveBeenCalledWith(moduleUndeployment.id, UndeploymentStatusEnum.FAILED)
    })
  })

})
