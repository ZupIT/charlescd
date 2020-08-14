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

import { DeploymentsController } from '../../../../app/v1/api/deployments/controller'
import { DeploymentsService } from '../../../../app/v1/api/deployments/services'
import { DeploymentsServiceStub } from '../../stubs'
import { CreateDeploymentRequestDto, ReadDeploymentDto } from '../../../../app/v1/api/deployments/dto'
import {
  CreateCircleDeploymentRequestUsecase,
  CreateDefaultDeploymentRequestUsecase,
  CreateUndeploymentRequestUsecase
} from '../../../../app/v1/api/deployments/use-cases'
import {
  CreateCircleDeploymentRequestUsecaseStub,
  CreateUndeploymentRequestUsecaseStub
} from '../../stubs/use-cases'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'

describe('DeploymentsController', () => {

  let deploymentsController: DeploymentsController
  let deploymentsService: DeploymentsService
  let createCircleDeploymentUseCase: CreateCircleDeploymentRequestUsecase
  let createDefaultDeploymentUseCase: CreateDefaultDeploymentRequestUsecase

  beforeEach(async() => {
    deploymentsService = new DeploymentsServiceStub() as DeploymentsService
    const undeploymentUseCase = new CreateUndeploymentRequestUsecaseStub() as unknown as CreateUndeploymentRequestUsecase
    createCircleDeploymentUseCase = new CreateCircleDeploymentRequestUsecaseStub() as unknown as CreateCircleDeploymentRequestUsecase
    createDefaultDeploymentUseCase = new CreateCircleDeploymentRequestUsecaseStub() as unknown as CreateDefaultDeploymentRequestUsecase
    deploymentsController = new DeploymentsController(deploymentsService, undeploymentUseCase, createCircleDeploymentUseCase, createDefaultDeploymentUseCase)
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
      jest.spyOn(createDefaultDeploymentUseCase, 'execute').mockImplementation(() => Promise.resolve(readUndeploymentDto))
      expect(await deploymentsController.createDeployment(createUndeploymentDto, 'circle-id')).toBe(readUndeploymentDto)
    })
  })
})
