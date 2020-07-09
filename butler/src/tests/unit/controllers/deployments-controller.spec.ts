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
import { DeploymentsController } from '../../../app/api/deployments/controller'
import { DeploymentsService } from '../../../app/api/deployments/services'
import { DeploymentsServiceStub } from '../../stubs'
import { CreateDeploymentRequestDto, CreateUndeploymentDto, ReadDeploymentDto, ReadUndeploymentDto } from '../../../app/api/deployments/dto'
import {
  CreateCircleDeploymentRequestUsecase,
  CreateDefaultDeploymentRequestUsecase,
  CreateUndeploymentRequestUsecase
} from '../../../app/api/deployments/use-cases'
import {
  CreateCircleDeploymentRequestUsecaseStub,
  CreateUndeploymentRequestUsecaseStub
} from '../../stubs/use-cases'
import {
  ComponentsRepositoryStub,
  DeploymentsRepositoryStub,
  ModulesRepositoryStub
} from '../../stubs/repository'
import { DeploymentStatusEnum, UndeploymentStatusEnum } from '../../../app/api/deployments/enums'

describe('DeploymentsController', () => {

  let deploymentsController: DeploymentsController
  let deploymentsService: DeploymentsService
  let createDefaultDeploymentRequestUsecase: CreateDefaultDeploymentRequestUsecase

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      controllers: [
        DeploymentsController
      ],
      providers: [
        {
          provide: DeploymentsService,
          useClass: DeploymentsServiceStub
        },
        {
          provide: CreateUndeploymentRequestUsecase,
          useClass: CreateUndeploymentRequestUsecaseStub
        },
        {
          provide: CreateCircleDeploymentRequestUsecase,
          useClass: CreateCircleDeploymentRequestUsecaseStub
        },
        {
          provide: CreateDefaultDeploymentRequestUsecase,
          useClass: CreateCircleDeploymentRequestUsecaseStub
        },
        {
          provide: 'DeploymentEntityRepository',
          useClass: DeploymentsRepositoryStub
        },
        {
          provide: 'ModuleEntityRepository',
          useClass: ModulesRepositoryStub
        },
        {
          provide: 'ComponentEntityRepository',
          useClass: ComponentsRepositoryStub
        }
      ]
    }).compile()

    deploymentsService = module.get<DeploymentsService>(DeploymentsService)
    deploymentsController = module.get<DeploymentsController>(DeploymentsController)
    createDefaultDeploymentRequestUsecase = module.get<CreateDefaultDeploymentRequestUsecase>(CreateDefaultDeploymentRequestUsecase)
  })

  describe('getDeployments', () => {
    it('should return an empty array of deployments representations', async() => {
      const result: ReadDeploymentDto[] = []
      jest.spyOn(deploymentsService, 'getDeployments').mockImplementation(() => Promise.resolve(result))
      expect(await deploymentsController.getDeployments()).toBe(result)
    })
  })
  describe('execute', () => {
    it('should return a read deployment dto', async() => {
      const readUndeploymentDto = new ReadDeploymentDto(
        'dummy-id',
        'app-name',
        [],
        'author-id',
        'description',
        DeploymentStatusEnum.CREATED,
        'callback',
        true,
        new Date(),
        undefined
      )
      const createUndeploymentDto = new CreateDeploymentRequestDto(
        'name',
        [],
        'author-id',
        'description',
        'callbackurl',
        null,
        'cd-id')
      jest.spyOn(createDefaultDeploymentRequestUsecase, 'execute').mockImplementation(() => Promise.resolve(readUndeploymentDto))
      expect(await deploymentsController.createDeployment(createUndeploymentDto, 'circle-id')).toBe(readUndeploymentDto)
    })
  })
})
