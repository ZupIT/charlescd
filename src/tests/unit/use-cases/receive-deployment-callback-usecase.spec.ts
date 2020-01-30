import { Test } from '@nestjs/testing'
import { ReceiveDeploymentCallbackUsecase } from '../../../app/api/notifications/use-cases'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelineQueuesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import { MooveService } from '../../../app/core/integrations/moove'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { PipelineQueuesService } from '../../../app/api/deployments/services'
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
    let deployment: DeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let pipelineQueuesService: PipelineQueuesService

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
            ]
        }).compile()

        receiveDeploymentCallbackUsecase = module.get<ReceiveDeploymentCallbackUsecase>(ReceiveDeploymentCallbackUsecase)
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)

        successfulFinishDeploymentDto = new FinishDeploymentDto('SUCCEEDED')
        failedFinishDeploymentDto = new FinishDeploymentDto('FAILED')

        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING
        )

        deployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-application-name',
            null,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            null,
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
    })

    describe('execute', () => {
        it('should update successful callback queued entry status to FINISHED', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'findOne')
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

        it('should update failed callback queued entry status to FINISHED', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(queuedDeployment))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))

            const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedDeploymentStatusFinished')
            await receiveDeploymentCallbackUsecase.execute(
                1234,
                failedFinishDeploymentDto
            )

            expect(queueSpy).toHaveBeenCalledWith(1234)
        })
    })
})
