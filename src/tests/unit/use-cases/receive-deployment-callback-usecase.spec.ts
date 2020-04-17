import { Test } from '@nestjs/testing'
import { ReceiveDeploymentCallbackUsecase } from '../../../app/api/notifications/use-cases'
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
    DeploymentsRepositoryStub,
    QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { FinishDeploymentDto } from '../../../app/api/notifications/dto'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedDeploymentEntity
} from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'

describe('ReceiveDeploymentCallbackUsecase', () => {

    let receiveDeploymentCallbackUsecase: ReceiveDeploymentCallbackUsecase
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let successfulFinishDeploymentDto: FinishDeploymentDto
    let failedFinishDeploymentDto: FinishDeploymentDto
    let queuedDeployment: QueuedDeploymentEntity
    let queuedDeploymentFinished: QueuedDeploymentEntity
    let deployment: DeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let pipelineQueuesService: PipelineQueuesService
    let statusManagementService: StatusManagementService
    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                ReceiveDeploymentCallbackUsecase,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub }
            ]
        }).compile()

        receiveDeploymentCallbackUsecase = module.get<ReceiveDeploymentCallbackUsecase>(ReceiveDeploymentCallbackUsecase)
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        successfulFinishDeploymentDto = new FinishDeploymentDto('SUCCEEDED')
        failedFinishDeploymentDto = new FinishDeploymentDto('FAILED')
        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING
        )
        queuedDeploymentFinished = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.FINISHED
        )

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
            'dummy-deployment-id',
            'dummy-application-name',
            [moduleDeployment],
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            null,
            false,
            'dummy-circle-id'
        )
        moduleDeployment.deployment = deployment

        componentDeployment.moduleDeployment = moduleDeployment
    })

    describe('execute', () => {
        it('should update successful callback queued entry status to FINISHED', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(queuedDeployment))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))

            const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedDeploymentStatusFinished')
            await receiveDeploymentCallbackUsecase.execute(
                1234,
                successfulFinishDeploymentDto
            )

            expect(queueSpy).toHaveBeenCalledWith(1234)
        })

        it('should not execute a finished deployment', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(queuedDeploymentFinished))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedDeploymentStatusFinished')
            await receiveDeploymentCallbackUsecase.execute(
                1234,
                successfulFinishDeploymentDto
            )
            expect(queueSpy).not.toHaveBeenCalledWith(1234)
        })
    })
})
