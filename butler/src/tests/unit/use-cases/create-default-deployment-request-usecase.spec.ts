import { Test } from '@nestjs/testing'
import {
    CreateCircleDeploymentRequestUsecase,
    CreateDefaultDeploymentRequestUsecase
} from '../../../app/api/deployments/use-cases'
import {
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub,
    QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import { QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import {
    PipelineDeploymentsService,
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import {
    ConsoleLoggerServiceStub,
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
    UndeploymentEntity
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

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateDefaultDeploymentRequestUsecase,
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'ModuleEntityRepository', useClass: ModulesRepositoryStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: PipelineDeploymentsService, useClass: PipelineDeploymentsServiceStub },
                { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
            ]
        }).compile()

        createDefaultDeploymentRequestUsecase = module.get<CreateDefaultDeploymentRequestUsecase>(CreateDefaultDeploymentRequestUsecase)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)

        componentDeployments = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag',
                'dummy-context-path',
                'dummy-health-check',
                1000
            ),
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name2',
                'dummy-img-url2',
                'dummy-img-tag2',
                'dummy-context-path2',
                'dummy-health-check2',
                1001
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
            'dummy-circle-id'
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
            createCircleDeploymentDto
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

            expect(await createDefaultDeploymentRequestUsecase.execute(createDeploymentDto, 'dummy-deployment-id'))
                .toEqual(deployment.toReadDto())
        })
    })
})
