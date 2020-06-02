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

import { ComponentDeploymentEntity, QueuedDeploymentEntity } from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { GetComponentQueueUseCase } from '../../../app/api/components/use-cases/get-component-queue.usecase'
import { Test } from '@nestjs/testing'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import { ComponentDeploymentsRepositoryStub, QueuedDeploymentsRepositoryStub } from '../../stubs/repository'

describe('execute', () => {

        let queuedDeploymentsRepository: QueuedDeploymentsRepository
        let componentDeploymentsRepository: ComponentDeploymentsRepository
        let componentDeployment: ComponentDeploymentEntity
        let getComponentQueueUseCase: GetComponentQueueUseCase
        let queuedDeployments: QueuedDeploymentEntity[]

        beforeEach(async () => {

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

            componentDeployment = new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag'
            )

            const module = await Test.createTestingModule({
                providers: [GetComponentQueueUseCase,
                    {
                        provide: ComponentDeploymentsRepository,
                        useClass: ComponentDeploymentsRepositoryStub
                    },
                    {
                        provide: QueuedDeploymentsRepository,
                        useClass: QueuedDeploymentsRepositoryStub
                    }]
            }).compile()

            getComponentQueueUseCase = module.get<GetComponentQueueUseCase>(GetComponentQueueUseCase)
            queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
            componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
        })

        it('should return a list of dto queued pipelines', async () => {
            jest.spyOn(componentDeploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdAscending')
                .mockImplementation(() => Promise.resolve(queuedDeployments))

            expect(await getComponentQueueUseCase.execute('dummy-id'))
                .toEqual(queuedDeployments.map(queuedDeployment => queuedDeployment.toReadDto()))
        })
    }
)
