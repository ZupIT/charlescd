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
import { QueryFailedError, Repository } from 'typeorm'
import { CreateUndeploymentDto } from '../../../app/api/deployments/dto'
import {
    ComponentDeploymentEntity, DeploymentEntity,
    ModuleDeploymentEntity, QueuedUndeploymentEntity, UndeploymentEntity, CircleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { PipelineDeploymentsService, PipelineErrorHandlerService, PipelineQueuesService } from '../../../app/api/deployments/services'
import { CreateUndeploymentRequestUsecase } from '../../../app/api/deployments/use-cases'
import { MooveService } from '../../../app/core/integrations/moove'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { StatusManagementService } from '../../../app/core/services/deployments'
import {
    ComponentDeploymentsRepositoryStub,
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    QueuedDeploymentsRepositoryStub,
    QueuedUndeploymentsRepositoryStub,
    UndeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ConsoleLoggerServiceStub, MooveServiceStub,
    PipelineDeploymentsServiceStub, PipelineErrorHandlerServiceStub,
    PipelineQueuesServiceStub, StatusManagementServiceStub
} from '../../stubs/services'
import { QueuedDeploymentsConstraints } from '../../../app/core/integrations/databases/constraints'

describe('CreateUndeploymentRequestUsecase', () => {

    let createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase
    let deploymentsRepository: Repository<DeploymentEntity>
    let undeploymentsRepository: Repository<UndeploymentEntity>
    let createUndeploymentDto: CreateUndeploymentDto
    let deployment: DeploymentEntity
    let undeployment: UndeploymentEntity
    let moduleDeployments: ModuleDeploymentEntity[]
    let componentDeployments: ComponentDeploymentEntity[]
    let pipelineQueuesService: PipelineQueuesService
    let queuedUndeployments: QueuedUndeploymentEntity[]
    let queuedUndeploymentRepository: Repository<QueuedUndeploymentEntity>

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateUndeploymentRequestUsecase,
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'UndeploymentEntityRepository', useClass: UndeploymentsRepositoryStub },
                { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
                { provide: 'QueuedUndeploymentEntityRepository', useClass: QueuedUndeploymentsRepositoryStub },
                { provide: PipelineDeploymentsService, useClass: PipelineDeploymentsServiceStub },
                { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
            ]
        }).compile()

        createUndeploymentRequestUsecase = module.get<CreateUndeploymentRequestUsecase>(CreateUndeploymentRequestUsecase)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        undeploymentsRepository = module.get<Repository<UndeploymentEntity>>('UndeploymentEntityRepository')
        queuedUndeploymentRepository = module.get<Repository<QueuedUndeploymentEntity>>('QueuedUndeploymentEntityRepository')

        createUndeploymentDto = new CreateUndeploymentDto('dummy-author-id','dummy-deployment-id')

        componentDeployments = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag'
            ),
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name2',
                'dummy-img-url2',
                'dummy-img-tag2'
            )
        ]

        moduleDeployments = [
            new ModuleDeploymentEntity(
                'dummy-id',
                'helm-repository',
                componentDeployments
            )
        ]

        deployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-application-name',
            moduleDeployments,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            null,
            false,
            'dummy-circle-id',
            'cd-configuration-id'
        )

        deployment.circle = new CircleDeploymentEntity('header-value')

        undeployment = new UndeploymentEntity(
            'dummy-author-id',
            deployment,
            'dummy-circle-id'
        )

        queuedUndeployments = [
            new QueuedUndeploymentEntity(
                'dummy-id',
                componentDeployments[0].id,
                QueuedPipelineStatusEnum.RUNNING,
                'dummy-id-2'
            ),
            new QueuedUndeploymentEntity(
                'dummy-id',
                componentDeployments[1].id,
                QueuedPipelineStatusEnum.QUEUED,
                'dummy-id-3'
            )
        ]
    })

    describe('execute', () => {
        it('should return the correct read dto for a given create dto', async () => {

            jest.spyOn(deploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(undeploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(undeployment))
            jest.spyOn(pipelineQueuesService, 'getQueuedPipelineStatus')
                .mockImplementation(() => Promise.resolve(QueuedPipelineStatusEnum.RUNNING))

            expect(await createUndeploymentRequestUsecase.execute(createUndeploymentDto, 'dummy-id'))
                .toEqual(undeployment.toReadDto())
        })

        it('should handle duplicated module undeployment', async () => {

            jest.spyOn(deploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(undeploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(undeployment))

            jest.spyOn(queuedUndeploymentRepository, 'save')
                .mockImplementationOnce(
                    () => { throw new QueryFailedError('query', [], { constraint: QueuedDeploymentsConstraints.UNIQUE_RUNNING_MODULE }) }
                )
                .mockImplementationOnce(() => Promise.resolve(queuedUndeployments[0]))

            expect(await createUndeploymentRequestUsecase.execute(createUndeploymentDto, 'dummy-id'))
                .toEqual(undeployment.toReadDto())
        })
    })
})
