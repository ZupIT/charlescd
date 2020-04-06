import { Test } from '@nestjs/testing'
import { QueryFailedError, Repository } from 'typeorm'
import { CreateCircleDeploymentDto, CreateCircleDeploymentRequestDto } from '../../../app/api/deployments/dto/create-deployment'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { PipelineDeploymentsService, PipelineErrorHandlerService, PipelineQueuesService } from '../../../app/api/deployments/services'
import { CreateCircleDeploymentRequestUsecase } from '../../../app/api/deployments/use-cases'
import { QueuedDeploymentsConstraints } from '../../../app/core/integrations/databases/constraints'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ComponentDeploymentsRepositoryStub,
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub,
    QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ConsoleLoggerServiceStub, PipelineDeploymentsServiceStub, PipelineErrorHandlerServiceStub, PipelineQueuesServiceStub
} from '../../stubs/services'

describe('CreateCircleDeploymentRequestUsecase', () => {

    let createCircleDeploymentRequestUsecase: CreateCircleDeploymentRequestUsecase
    let deploymentsRepository: Repository<DeploymentEntity>
    let deployment: DeploymentEntity
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let moduleDeployments: ModuleDeploymentEntity[]
    let componentDeployments: ComponentDeploymentEntity[]
    let createCircleDeploymentDto: CreateCircleDeploymentDto
    let createDeploymentDto: CreateCircleDeploymentRequestDto
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let queuedDeployment: QueuedDeploymentEntity

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateCircleDeploymentRequestUsecase,
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'ModuleEntityRepository', useClass: ModulesRepositoryStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
                { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: PipelineDeploymentsService, useClass: PipelineDeploymentsServiceStub },
                { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
            ]
        }).compile()

        createCircleDeploymentRequestUsecase = module.get<CreateCircleDeploymentRequestUsecase>(CreateCircleDeploymentRequestUsecase)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)

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

            expect(await createCircleDeploymentRequestUsecase.execute(createDeploymentDto, 'dummy-deployment-id'))
                .toEqual(deployment.toReadDto())
        })

        it('should handle duplicated module deployment', async () => {
            jest.spyOn(deploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(deployment))

            jest.spyOn(queuedDeploymentsRepository, 'save')
                .mockImplementationOnce(
                    () => { throw new QueryFailedError('query', [], { constraint: QueuedDeploymentsConstraints.UNIQUE_RUNNING_MODULE }) }
                ).mockImplementationOnce(() => Promise.resolve(queuedDeployment))

            expect(
                await createCircleDeploymentRequestUsecase.execute(createDeploymentDto, 'dummy-deployment-id')
            ).toEqual(deployment.toReadDto())
        })
    })
})
