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
  DeploymentsService,
  PipelineQueuesService
} from '../../../app/api/deployments/services'
import { DeploymentsRepositoryStub } from '../../stubs/repository'
import {
  ConsoleLoggerServiceStub,
  MooveServiceStub,
  PipelineQueuesServiceStub,
  StatusManagementServiceStub
} from '../../stubs/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { MooveService } from '../../../app/core/integrations/moove'

describe('Deployments service specs', () => {
  let deploymentsService: DeploymentsService
  let deploymentsRepository: Repository<DeploymentEntity>
  let circle: CircleDeploymentEntity
  let deployment: DeploymentEntity
  let moduleDeployment: ModuleDeploymentEntity
  let componentDeployment: ComponentDeploymentEntity

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      providers: [
        DeploymentsService,
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
        { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
        { provide: StatusManagementService, useClass: StatusManagementServiceStub },
        { provide: MooveService, useClass: MooveServiceStub },
      ]
    }).compile()

    deploymentsService = module.get<DeploymentsService>(DeploymentsService)
    deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')

    circle = new CircleDeploymentEntity('header-value')

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
  })

  describe('getDeployments', () => {

    it('should correctly return deployments as dtos', async() => {

      jest.spyOn(deploymentsRepository, 'find')
        .mockImplementation(() => Promise.resolve([deployment]))

      expect(await deploymentsService.getDeployments()).toStrictEqual([deployment.toReadDto()])
    })
  })
})
