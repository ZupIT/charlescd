import { Test } from '@nestjs/testing'
import { ReceiveUndeploymentCallbackUsecase } from '../../../app/api/notifications/use-cases'
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
    ComponentUndeploymentsRepositoryStub,
    DeploymentsRepositoryStub,
    QueuedUndeploymentsRepositoryStub
} from '../../stubs/repository'
import { ComponentUndeploymentsRepository } from '../../../app/api/deployments/repository'
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
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'

describe('ReceiveUndeploymentCallbackUsecase', () => {

    let receiveUndeploymentCallbackUsecase: ReceiveUndeploymentCallbackUsecase
    let componentUndeploymentsRepository: ComponentUndeploymentsRepository
    let queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>
    let pipelineQueuesService: PipelineQueuesService
    let successfulFinishUndeploymentDto: FinishUndeploymentDto
    let failedFinishUndeploymentDto: FinishUndeploymentDto
    let queuedUndeployment: QueuedUndeploymentEntity
    let undeployment: UndeploymentEntity
    let moduleUndeployment: ModuleUndeploymentEntity
    let componentUndeployment: ComponentUndeploymentEntity
    let deployment: DeploymentEntity
    let moduleDeployments: ModuleDeploymentEntity[]
    let componentDeployments: ComponentDeploymentEntity[]

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
            ]
        }).compile()

        receiveUndeploymentCallbackUsecase = module.get<ReceiveUndeploymentCallbackUsecase>(ReceiveUndeploymentCallbackUsecase)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        queuedUndeploymentsRepository = module.get<Repository<QueuedUndeploymentEntity>>('QueuedUndeploymentEntityRepository')
        componentUndeploymentsRepository = module.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)

        successfulFinishUndeploymentDto = new FinishUndeploymentDto('SUCCEEDED')
        failedFinishUndeploymentDto = new FinishUndeploymentDto('FAILED')

        queuedUndeployment = new QueuedUndeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING,
            'dummy-component-undeployment-id'
        )

        componentDeployments = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag',
                'dummy-context-path',
                'dummy-health-check',
                1234
            ),
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

        moduleDeployments = [
            new ModuleDeploymentEntity(
                'dummy-id',
                'dummy-id',
                componentDeployments
            )
        ]

        deployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-valueflow-id',
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

        moduleUndeployment = new ModuleUndeploymentEntity(
            null,
            null
        )
        moduleUndeployment.undeployment = undeployment

        componentUndeployment = new ComponentUndeploymentEntity(
            null
        )
        componentUndeployment.moduleUndeployment = moduleUndeployment
    })

    describe('execute', () => {
        it('should update successful callback queued entry status to FINISHED', async () => {

            jest.spyOn(queuedUndeploymentsRepository, 'findOne')
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

        it('should update failed callback queued entry status to FINISHED', async () => {

            jest.spyOn(queuedUndeploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(queuedUndeployment))
            jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentUndeployment))

            const queueSpy = jest.spyOn(pipelineQueuesService, 'setQueuedUndeploymentStatusFinished')
            await receiveUndeploymentCallbackUsecase.execute(
                1234,
                failedFinishUndeploymentDto
            )

            expect(queueSpy).toHaveBeenCalledWith(1234)
        })
    })
})
