import { Test } from '@nestjs/testing'
import {
    PipelineQueuesService,
    PipelinesService
} from '../../../app/api/deployments/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelinesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import {
    ComponentDeploymentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub,
    QueuedDeploymentsRepositoryStub,
    QueuedUndeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import {
    DeploymentStatusEnum,
    QueuedPipelineStatusEnum
} from '../../../app/api/deployments/enums'
import {
    CircleDeploymentEntity,
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedDeploymentEntity,
    QueuedUndeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { MooveService } from '../../../app/core/integrations/moove'
import { NotificationStatusEnum } from '../../../app/api/notifications/enums'

describe('PipelineQueuesService', () => {

    let pipelineQueuesService: PipelineQueuesService
    let queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let queuedUndeployment: QueuedUndeploymentEntity
    let queuedDeployment: QueuedDeploymentEntity
    let nextQueuedDeployments: QueuedDeploymentEntity[]
    let circle: CircleDeploymentEntity
    let deployment: DeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let pipelinesService: PipelinesService
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let deploymentWithRelations: DeploymentEntity
    let moduleDeploymentWithRelations: ModuleDeploymentEntity
    let moduleDeploymentsList: ModuleDeploymentEntity[]
    let componentDeploymentsList: ComponentDeploymentEntity[]

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                PipelineQueuesService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelinesService, useClass: PipelinesServiceStub },
                { provide: QueuedDeploymentsRepository, useClass:  QueuedDeploymentsRepositoryStub},
                { provide: 'QueuedUndeploymentEntityRepository', useClass:  QueuedUndeploymentsRepositoryStub},
                { provide: ComponentDeploymentsRepository, useClass:  ComponentDeploymentsRepositoryStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'ModuleEntityRepository', useClass: ModulesRepositoryStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
            ]
        }).compile()

        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
        queuedUndeploymentsRepository = module.get<Repository<QueuedUndeploymentEntity>>('QueuedUndeploymentEntityRepository')
        pipelinesService = module.get<PipelinesService>(PipelinesService)
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        mooveService = module.get<MooveService>(MooveService)

        queuedUndeployment = new QueuedUndeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING,
            'dummy-component-undeployment-id'
        )

        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING,
        )

        nextQueuedDeployments = [
            new QueuedDeploymentEntity(
                'dummy-component-id',
                'dummy-component-deployment-id',
                QueuedPipelineStatusEnum.QUEUED,
            ),
            new QueuedDeploymentEntity(
                'dummy-component-id',
                'dummy-component-deployment-id2',
                QueuedPipelineStatusEnum.QUEUED,
            ),
            new QueuedDeploymentEntity(
                'dummy-component-id',
                'dummy-component-deployment-id3',
                QueuedPipelineStatusEnum.QUEUED,
            )
        ]

        nextQueuedDeployments[0].id = 110
        nextQueuedDeployments[1].id = 111
        nextQueuedDeployments[2].id = 112

        circle = new CircleDeploymentEntity('dummy-circle', false)

        deployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-application-name',
            null,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            circle,
            false,
            'dummy-circle-id'
        )

        moduleDeployment = new ModuleDeploymentEntity(
            'dummy-id',
            'dummy-id',
            null
        )
        moduleDeployment.deployment = deployment

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag',
            'dummy-context-path',
            'dummy-health-check',
            1234
        )
        componentDeployment.moduleDeployment = moduleDeployment

        componentDeploymentsList = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag',
                'dummy-context-path',
                'dummy-health-check',
                1234
            )
        ]

        moduleDeploymentWithRelations = new ModuleDeploymentEntity(
            'dummy-id',
            'dummy-id',
            componentDeploymentsList
        )

        moduleDeploymentsList = [
            moduleDeploymentWithRelations
        ]

        deploymentWithRelations = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-valueflow-id',
            moduleDeploymentsList,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            circle,
            false,
            'dummy-circle-id'
        )
    })

    describe('enqueueUndeploymentExecution', () => {
        it('should save a new queued undeployment with the correct params', async () => {

            const queueSpy = jest.spyOn(queuedUndeploymentsRepository, 'save')

            await pipelineQueuesService.enqueueUndeploymentExecution(
                queuedUndeployment.componentId,
                queuedUndeployment.componentDeploymentId,
                queuedUndeployment.status,
                queuedUndeployment.componentUndeploymentId
            )

            expect(queueSpy).toHaveBeenCalledWith(queuedUndeployment)
        })
    })

    describe('enqueueDeploymentExecution', () => {
        it('should save a new queued deployment with the correct params', async () => {

            const queueSpy = jest.spyOn(queuedDeploymentsRepository, 'save')

            await pipelineQueuesService.enqueueDeploymentExecution(
                queuedDeployment.componentId,
                queuedDeployment.componentDeploymentId,
                queuedDeployment.status
            )

            expect(queueSpy).toHaveBeenCalledWith(queuedDeployment)
        })
    })

    describe('triggerNextComponentPipeline', () => {

        it('should update next queued pipeline status to RUNNING', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdQueuedAscending')
                .mockImplementation(() => Promise.resolve(nextQueuedDeployments))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))

            const queueSpy = jest.spyOn(queuedDeploymentsRepository, 'update')

            await pipelineQueuesService.triggerNextComponentPipeline(
                'dummy-component-deployment-id'
            )

            expect(queueSpy)
                .toHaveBeenCalledWith({ id: nextQueuedDeployments[0].id }, { status: QueuedPipelineStatusEnum.RUNNING })
        })

        it('should set status to finished, notify application and trigger next component deployment on exception', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdQueuedAscending')
                .mockImplementationOnce(() => Promise.resolve(nextQueuedDeployments))
                .mockImplementationOnce(() => Promise.resolve(nextQueuedDeployments.slice(1)))

            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))

            jest.spyOn(queuedDeploymentsRepository, 'findOne')
                .mockImplementationOnce(() => Promise.resolve(nextQueuedDeployments[0]))
                .mockImplementationOnce(() => Promise.resolve(nextQueuedDeployments[1]))

            jest.spyOn(pipelinesService, 'triggerDeployment')
                .mockImplementationOnce(() => { throw new Error() })
                .mockImplementationOnce(() => Promise.resolve())

            const updateSpy = jest.spyOn(queuedDeploymentsRepository, 'update')
            const triggerPipelineSpy = jest.spyOn(pipelinesService, 'triggerDeployment')
            const statusSpy = jest.spyOn(statusManagementService, 'deepUpdateDeploymentStatus')
            const applicationSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

            await pipelineQueuesService.triggerNextComponentPipeline('dummy-component-deployment-id')

            expect(updateSpy)
                .toHaveBeenNthCalledWith(1, { id: nextQueuedDeployments[0].id }, { status: QueuedPipelineStatusEnum.FINISHED })
            expect(triggerPipelineSpy).toHaveBeenLastCalledWith(
                componentDeployment.id,
                componentDeployment.moduleDeployment.deployment.defaultCircle,
                nextQueuedDeployments[1].id
            )
            expect(statusSpy)
                .toHaveBeenNthCalledWith(1, deployment, DeploymentStatusEnum.FAILED)
            expect(applicationSpy)
                .toHaveBeenNthCalledWith(1, deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId)
        })

        it('should trigger pipeline of the first queued deployment', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdQueuedAscending')
                .mockImplementation(() => Promise.resolve(nextQueuedDeployments))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            jest.spyOn(queuedDeploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(nextQueuedDeployments[0]))
            const findSpy = jest.spyOn(queuedDeploymentsRepository, 'findOne')
            const triggerPipelineSpy = jest.spyOn(pipelinesService, 'triggerDeployment')

            await pipelineQueuesService.triggerNextComponentPipeline('dummy-component-deployment-id')

            expect(findSpy).toHaveBeenCalledWith({ id : nextQueuedDeployments[0].id })
            expect(triggerPipelineSpy).toHaveBeenCalledWith(
                componentDeployment.id,
                componentDeployment.moduleDeployment.deployment.defaultCircle,
                nextQueuedDeployments[0].id
            )
        })
    })

    describe('queueDeploymentTasks', () => {
        it('should set queued deployment status to finished and trigger next deployment inside queue', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'getOneByComponentIdRunning')
                .mockImplementationOnce(() => Promise.resolve(undefined))
            jest.spyOn(queuedDeploymentsRepository, 'save')
                .mockImplementationOnce(() => Promise.resolve(nextQueuedDeployments[0]))
            jest.spyOn(pipelinesService, 'triggerDeployment')
                .mockImplementationOnce(() => { throw new Error() })
            jest.spyOn(pipelineQueuesService, 'triggerNextComponentPipeline')
                .mockImplementation(() => Promise.resolve())

            const updateSpy = jest.spyOn(queuedDeploymentsRepository, 'update')
            const queueSpy = jest.spyOn(pipelineQueuesService, 'triggerNextComponentPipeline')

            await expect(pipelineQueuesService.queueDeploymentTasks(deploymentWithRelations))
                .rejects.toThrowError(Error)
            expect(updateSpy)
                .toHaveBeenNthCalledWith(1, { id: nextQueuedDeployments[0].id }, { status: QueuedPipelineStatusEnum.FINISHED })
            expect(queueSpy).toHaveBeenCalledTimes(1)
        })
    })
})
