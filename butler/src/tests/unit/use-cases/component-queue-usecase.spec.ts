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

import { GetComponentQueueUseCase } from '../../../app/v1/api/components/use-cases/get-component-queue.usecase'
import { ComponentDeploymentEntity, QueuedDeploymentEntity } from '../../../app/v1/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/v1/api/deployments/enums'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../../../app/v1/api/deployments/repository'
import { ComponentDeploymentsRepositoryStub, QueuedDeploymentsRepositoryStub } from '../../stubs/repository'

describe('execute', () => {

  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let componentDeployment: ComponentDeploymentEntity
  let getComponentQueueUseCase: GetComponentQueueUseCase
  let queuedDeployments: QueuedDeploymentEntity[]

  beforeEach(async() => {
    queuedDeploymentsRepository = new QueuedDeploymentsRepositoryStub() as unknown as QueuedDeploymentsRepository
    componentDeploymentsRepository = new ComponentDeploymentsRepositoryStub() as unknown as ComponentDeploymentsRepository
    getComponentQueueUseCase = new GetComponentQueueUseCase(queuedDeploymentsRepository, componentDeploymentsRepository)
  })

  it('should return a list of dto queued pipelines', async() => {
    componentDeployment = new ComponentDeploymentEntity(
      'dummy-id',
      'dummy-name',
      'dummy-img-url',
      'dummy-img-tag'
    )
    queuedDeployments = [
      new QueuedDeploymentEntity(
        'dummy-id',
        'dummy-deployment-id',
        QueuedPipelineStatusEnum.QUEUED,
      ),
      new QueuedDeploymentEntity(
        'dummy-id',
        'dummy-other-deployment-id',
        QueuedPipelineStatusEnum.QUEUED,
      )
    ]

    jest.spyOn(componentDeploymentsRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(componentDeployment))
    jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdAscending')
      .mockImplementation(() => Promise.resolve(queuedDeployments))

    expect(await getComponentQueueUseCase.execute('dummy-id'))
      .toEqual(queuedDeployments.map(queuedDeployment => queuedDeployment.toReadDto()))
  })
}
)
