import { Test } from '@nestjs/testing'
import { CreateUndeploymentRequestUsecase } from '../../../app/api/deployments/use-cases'
import { QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import {
    PipelineQueuesService,
    PipelinesService
} from '../../../app/api/deployments/services'
import {
    DeploymentsRepositoryStub,
    QueuedDeploymentsRepositoryStub,
    UndeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    MooveServiceStub,
    PipelineQueuesServiceStub,
    PipelinesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import { CreateUndeploymentDto } from '../../../app/api/deployments/dto'
import {
    QueuedPipelineStatusEnum,
    UndeploymentStatusEnum
} from '../../../app/api/deployments/enums'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedUndeploymentEntity,
    UndeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { NotificationStatusEnum } from '../../../app/api/notifications/enums'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { MooveService } from '../../../app/core/integrations/moove'

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
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let pipelinesService: PipelinesService

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateUndeploymentRequestUsecase,
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'UndeploymentEntityRepository', useClass: UndeploymentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: PipelinesService, useClass: PipelinesServiceStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
            ]
        }).compile()

        createUndeploymentRequestUsecase = module.get<CreateUndeploymentRequestUsecase>(CreateUndeploymentRequestUsecase)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        undeploymentsRepository = module.get<Repository<UndeploymentEntity>>('UndeploymentEntityRepository')
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        mooveService = module.get<MooveService>(MooveService)
        pipelinesService = module.get<PipelinesService>(PipelinesService)

        createUndeploymentDto = new CreateUndeploymentDto('dummy-author-id')

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
                'dummy-id',
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

        undeployment = new UndeploymentEntity(
            'dummy-author-id',
            deployment
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

            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(undeploymentsRepository, 'save')
                .mockImplementation( () => Promise.resolve(undeployment))
            jest.spyOn(pipelineQueuesService, 'getQueuedPipelineStatus')
                .mockImplementation(() => Promise.resolve(QueuedPipelineStatusEnum.RUNNING))
            jest.spyOn(pipelineQueuesService, 'enqueueUndeploymentExecution')
                .mockImplementation(() => Promise.resolve(queuedUndeployments[0]))

            expect(await createUndeploymentRequestUsecase.execute(createUndeploymentDto, 'dummy-deployment-id'))
                .toEqual(undeployment.toReadDto())
        })

        it('should correctly handle undeployment request failure', async () => {

            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(undeploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(undeployment))
            jest.spyOn(pipelineQueuesService, 'getQueuedPipelineStatus')
                .mockImplementation(() => Promise.resolve(QueuedPipelineStatusEnum.RUNNING))
            jest.spyOn(pipelinesService, 'triggerUndeployment')
                .mockImplementation(() => { throw new Error() })

            const statusSpy = jest.spyOn(statusManagementService, 'deepUpdateUndeploymentStatus')
            const applicationSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

            await expect(createUndeploymentRequestUsecase.execute(createUndeploymentDto, 'dummy-deployment-id'))
                .rejects.toThrowError(Error)
            expect(statusSpy)
                .toHaveBeenCalledWith(undeployment, UndeploymentStatusEnum.FAILED)
            expect(applicationSpy)
                .toHaveBeenCalledWith(
                    undeployment.deployment.id, NotificationStatusEnum.UNDEPLOY_FAILED,
                    undeployment.deployment.callbackUrl, undeployment.deployment.circleId
                )
        })

        it('should correctly handle single component undeployment failure', async () => {

            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementationOnce(() => Promise.resolve(deployment))

            jest.spyOn(undeploymentsRepository, 'save')
                .mockImplementationOnce(() => Promise.resolve(undeployment))

            jest.spyOn(pipelineQueuesService, 'getQueuedPipelineStatus')
                .mockImplementationOnce(() => Promise.resolve(QueuedPipelineStatusEnum.RUNNING))
                .mockImplementationOnce(() => Promise.resolve(QueuedPipelineStatusEnum.QUEUED))

            jest.spyOn(pipelineQueuesService, 'enqueueUndeploymentExecution')
                .mockImplementationOnce(() => Promise.resolve(queuedUndeployments[0]))
                .mockImplementationOnce(() => Promise.resolve(queuedUndeployments[1]))

            jest.spyOn(pipelinesService, 'triggerUndeployment')
                .mockImplementation(() => { throw new Error() })

            const finishedSpy = jest.spyOn(pipelineQueuesService, 'setQueuedUndeploymentStatusFinished')
            const queueSpy = jest.spyOn(pipelineQueuesService, 'triggerNextComponentPipeline')

            await expect(createUndeploymentRequestUsecase.execute(createUndeploymentDto, 'dummy-deployment-id'))
                .rejects.toThrowError(Error)

            expect(finishedSpy).toHaveBeenNthCalledWith(1, queuedUndeployments[0].id)
            expect(queueSpy).toHaveBeenNthCalledWith(1, queuedUndeployments[0].componentDeploymentId)
        })
    })
})
