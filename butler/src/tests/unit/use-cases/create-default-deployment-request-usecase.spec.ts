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
    CreateDefaultDeploymentRequestUsecase
} from '../../../app/api/deployments/use-cases'
import {
    ComponentDeploymentsRepositoryStub,
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub,
    QueuedDeploymentsRepositoryStub,
    QueuedIstioDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository,
    QueuedIstioDeploymentsRepository
} from '../../../app/api/deployments/repository'
import {
    ModulesService,
    PipelineDeploymentsService,
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import {
    ConsoleLoggerServiceStub, ModulesServiceStub,
    PipelineDeploymentsServiceStub,
    PipelineErrorHandlerServiceStub,
    PipelineQueuesServiceStub
} from '../../stubs/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedDeploymentEntity,
} from '../../../app/api/deployments/entity'
import {
    CreateCircleDeploymentDto,
    CreateCircleDeploymentRequestDto
} from '../../../app/api/deployments/dto/create-deployment'
import { Repository, QueryFailedError } from 'typeorm'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { QueuedDeploymentsConstraints } from '../../../app/core/integrations/databases/constraints'

describe('CreateDefaultDeploymentRequestUsecase', () => {

    let createDefaultDeploymentRequestUsecase: CreateDefaultDeploymentRequestUsecase
    let deploymentsRepository: Repository<DeploymentEntity>
    let deployment: DeploymentEntity
    let moduleDeployments: ModuleDeploymentEntity[]
    let componentDeployments: ComponentDeploymentEntity[]
    let createCircleDeploymentDto: CreateCircleDeploymentDto
    let createDeploymentDto: CreateCircleDeploymentRequestDto
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let queuedDeployment: QueuedDeploymentEntity
    let modulesService: ModulesService

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateDefaultDeploymentRequestUsecase,
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'ModuleEntityRepository', useClass: ModulesRepositoryStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
                { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: PipelineDeploymentsService, useClass: PipelineDeploymentsServiceStub },
                { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
                { provide: ModulesService, useClass: ModulesServiceStub},
                { provide: QueuedIstioDeploymentsRepository, useClass: QueuedIstioDeploymentsRepositoryStub }
            ]
        }).compile()

        createDefaultDeploymentRequestUsecase = module.get<CreateDefaultDeploymentRequestUsecase>(CreateDefaultDeploymentRequestUsecase)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        modulesService = module.get<ModulesService>(ModulesService)

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

        createCircleDeploymentDto = new CreateCircleDeploymentDto(
            'header-value'
        )

        createDeploymentDto = new CreateCircleDeploymentRequestDto(
            'deployment-id',
            'application-name',
            [],
            'author-id',
            'description',
            'callback-url',
            createCircleDeploymentDto,
            'cd-configuration-id'
        )

        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING
        )
    })

    describe('execute', () => {
        it('should return the correct read dto for a given create dto', async () => {

            jest.spyOn(deploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(queuedDeploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(queuedDeployment))
            jest.spyOn(modulesService, 'createModules')
                .mockImplementation()

            expect(await createDefaultDeploymentRequestUsecase.execute(createDeploymentDto, 'dummy-deployment-id'))
                .toEqual(deployment.toReadDto())
        })

        it('should handle duplicated module default deployment', async () => {

            jest.spyOn(deploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(queuedDeploymentsRepository, 'save')
                .mockImplementationOnce(
                    () => { throw new QueryFailedError('query', [], { constraint: QueuedDeploymentsConstraints.UNIQUE_RUNNING_MODULE }) }
                ).mockImplementationOnce(() => Promise.resolve(queuedDeployment))
            jest.spyOn(modulesService, 'createModules')
                .mockImplementation()

            expect(await createDefaultDeploymentRequestUsecase.execute(createDeploymentDto, 'dummy-deployment-id'))
                .toEqual(deployment.toReadDto())
        })
    })
})
