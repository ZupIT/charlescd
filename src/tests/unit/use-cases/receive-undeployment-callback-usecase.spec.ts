import { Test } from '@nestjs/testing'
import { ReceiveUndeploymentCallbackUsecase } from '../../../app/api/notifications/use-cases'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelineErrorHandlerServiceStub,
    PipelineQueuesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import { MooveService } from '../../../app/core/integrations/moove'
import { StatusManagementService } from '../../../app/core/services/deployments'
import {
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import {
    ComponentDeploymentsRepositoryStub,
    ComponentUndeploymentsRepositoryStub,
    DeploymentsRepositoryStub,
    QueuedUndeploymentsRepositoryStub,
    UndeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ComponentDeploymentsRepository,
    ComponentUndeploymentsRepository
} from '../../../app/api/deployments/repository'
import { FinishUndeploymentDto } from '../../../app/api/notifications/dto'
import {
    ComponentDeploymentEntity,
    ComponentUndeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    ModuleUndeploymentEntity,
    QueuedUndeploymentEntity,
    UndeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { QueuedPipelineStatusEnum, UndeploymentStatusEnum } from '../../../app/api/deployments/enums'

import { NotificationStatusEnum } from '../../../app/api/notifications/enums';

describe('ReceiveUndeploymentCallbackUsecase', () => {

    let receiveUndeploymentCallbackUsecase: ReceiveUndeploymentCallbackUsecase
    let componentUndeploymentsRepository: ComponentUndeploymentsRepository
    let queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>
    let undeploymentsRepository: Repository<UndeploymentEntity>
    let pipelineQueuesService: PipelineQueuesService
    let successfulFinishUndeploymentDto: FinishUndeploymentDto
    let failedFinishUndeploymentDto: FinishUndeploymentDto
    let queuedUndeployment: QueuedUndeploymentEntity
    let queuedUndeploymentFinished: QueuedUndeploymentEntity
    let undeployment: UndeploymentEntity
    let moduleUndeployment: ModuleUndeploymentEntity
    let componentUndeployment: ComponentUndeploymentEntity
    let deployment: DeploymentEntity
    let moduleDeployments: ModuleDeploymentEntity[]
    let componentDeployments: ComponentDeploymentEntity[]
    let pipelineErrorHandlerService: PipelineErrorHandlerService
    let mooveService: MooveService

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                ReceiveUndeploymentCallbackUsecase,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: 'QueuedUndeploymentEntityRepository', useClass: QueuedUndeploymentsRepositoryStub },
                { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
                { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
                { provide: 'UndeploymentsRepository', useClass: UndeploymentsRepositoryStub },
            ]
        }).compile()

        receiveUndeploymentCallbackUsecase = module.get<ReceiveUndeploymentCallbackUsecase>(ReceiveUndeploymentCallbackUsecase)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        queuedUndeploymentsRepository = module.get<Repository<QueuedUndeploymentEntity>>('QueuedUndeploymentEntityRepository')
        componentUndeploymentsRepository = module.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)
        pipelineErrorHandlerService = module.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)
        mooveService = module.get<MooveService>(MooveService)
        successfulFinishUndeploymentDto = new FinishUndeploymentDto('SUCCEEDED')
        failedFinishUndeploymentDto = new FinishUndeploymentDto('FAILED')

        undeploymentsRepository = module.get<Repository<UndeploymentEntity>>('UndeploymentsRepository')
        queuedUndeployment = new QueuedUndeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING,
            'dummy-component-undeployment-id'
        )

        queuedUndeploymentFinished = new QueuedUndeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.FINISHED,
            'dummy-component-undeployment-id'
        )

        componentDeployments = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag'
            ),
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag'
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
            'another-circle-id'
        )

        undeployment = new UndeploymentEntity(
            'dummy-author-id',
            deployment,
            'dummy-circle-id'
        )
        undeployment.deployment = deployment
        undeployment.status  = UndeploymentStatusEnum.FINISHED


        componentUndeployment = new ComponentUndeploymentEntity(
            componentDeployments[0]
        )
        moduleUndeployment = new ModuleUndeploymentEntity(
            moduleDeployments[0],
            [componentUndeployment]
        )
        moduleUndeployment.undeployment = undeployment

        componentUndeployment.moduleUndeployment = moduleUndeployment
    })

    describe('execute', () => {
        it('should update successful callback queued entry status to FINISHED', async () => {

            jest.spyOn(queuedUndeploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(queuedUndeployment))
            jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentUndeployment))

            const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedUndeploymentStatusFinished')
            await receiveUndeploymentCallbackUsecase.execute(
                1234,
                successfulFinishUndeploymentDto
            )

            expect(queueSpy).toHaveBeenCalledWith(1234)
        })

        it('should not execute a finished undeployment', async () => {
            jest.spyOn(queuedUndeploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(queuedUndeploymentFinished))
            jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentUndeployment))
            const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedUndeploymentStatusFinished')
            await receiveUndeploymentCallbackUsecase.execute(
                1234,
                successfulFinishUndeploymentDto
            )
            expect(queueSpy).not.toHaveBeenCalledWith(1234)

        })

        it('should handle a failed undeployment callback', async () => {

            jest.spyOn(queuedUndeploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(queuedUndeployment))
            jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentUndeployment))
            const queueSpy = jest.spyOn(pipelineErrorHandlerService, 'handleUndeploymentFailure')
            const queueSpy1 = jest.spyOn(pipelineErrorHandlerService, 'handleComponentUndeploymentFailure')
            await receiveUndeploymentCallbackUsecase.execute(
                1234,
                failedFinishUndeploymentDto
            )
            expect(queueSpy).toHaveBeenCalled()
            expect(queueSpy1).toHaveBeenCalled()
        })

        it('should call mooveService with undeployment circle-id', async () => {
            jest.spyOn(queuedUndeploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(queuedUndeployment))
            jest.spyOn(undeploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(undeployment))
            jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentUndeployment))

            const mooveSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

            await receiveUndeploymentCallbackUsecase.execute(
                1234,
                successfulFinishUndeploymentDto
            )
            expect(mooveSpy).toHaveBeenCalledWith(deployment.id,NotificationStatusEnum.UNDEPLOYED,deployment.callbackUrl,undeployment.circleId)
        })
    })
})
