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

import { UndeploymentsController } from '../../../app/api/deployments/controller/undeployments.controller'
import { CreateUndeploymentRequestUsecase } from '../../../app/api/deployments/use-cases'
import { CreateUndeploymentRequestUsecaseStub } from '../../stubs/use-cases'
import { ReadUndeploymentDto } from '../../../app/api/deployments/dto/read-undeployment'
import {  UndeploymentStatusEnum } from '../../../app/api/deployments/enums'
import { CreateUndeploymentDto } from '../../../app/api/deployments/dto/create-undeployment'

describe('DeploymentsController', () => {

  let undeploymentsController: UndeploymentsController
  let createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase

  beforeEach(async() => {

    createUndeploymentRequestUsecase = new CreateUndeploymentRequestUsecaseStub() as unknown as CreateUndeploymentRequestUsecase
    undeploymentsController = new UndeploymentsController(createUndeploymentRequestUsecase)
  })

  describe('getDeployments', () => {
    it('should return an empty array of deployments representations', async() => {
      const readUndeploymentDto = new ReadUndeploymentDto('dummy-id', 'author-id', new Date(), 'deployment-id', UndeploymentStatusEnum.SUCCEEDED, 'circle-id', [])
      const createUndeploymentDto = new CreateUndeploymentDto('author-id', 'deployment-id')
      jest.spyOn(createUndeploymentRequestUsecase, 'execute').mockImplementation(() => Promise.resolve(readUndeploymentDto))
      expect(await undeploymentsController.createUndeployment(createUndeploymentDto, 'circle-id')).toBe(readUndeploymentDto)
    })
  })
})
