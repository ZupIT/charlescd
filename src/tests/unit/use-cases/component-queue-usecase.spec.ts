import {} from '../../../app/api/deployments/enums'
import {QueuedDeploymentEntity, QueuedUndeploymentEntity} from '../../../app/api/deployments/entity'
import {QueuedPipelineStatusEnum} from '../../../app/api/deployments/enums'
import {ComponentQueueUseCase} from '../../../app/api/components/use-cases/component-queue.usecase'
import {Test} from '@nestjs/testing'
import {PipelineQueuesService, PipelinesService} from '../../../app/api/deployments/services'
import {QueuedDeploymentsRepository} from '../../../app/api/deployments/repository'
import {QueuedDeploymentsRepositoryStub} from '../../stubs/repository'
import {PipelineQueuesServiceStub, PipelinesServiceStub} from '../../stubs/services'

describe('execute', () => {
    let pipelineQueuesService: PipelineQueuesService
    let componentQueueUsecase: ComponentQueueUseCase
    let queuedDeployments: QueuedDeploymentEntity[]
    beforeEach(async () => {
        queuedDeployments = [
            new QueuedDeploymentEntity(
                'dummy-id',
                'dummy-deployment-id',
                QueuedPipelineStatusEnum.QUEUED,
            ),
            new QueuedDeploymentEntity(
                'dummy-id',
                'dummy-other-deployment-id',
                QueuedPipelineStatusEnum.QUEUED,
            )
        ]
        const module = await Test.createTestingModule({
            providers: [PipelineQueuesService, ComponentQueueUseCase,
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: PipelinesService, useClass: PipelinesServiceStub }]
        }).compile()
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        componentQueueUsecase = module.get<ComponentQueueUseCase>(ComponentQueueUseCase)
    })
    it('should return a list of dto queued pipelines', async () => {

        jest.spyOn(pipelineQueuesService, 'getComponentDeploymentQueue')
            .mockImplementation((id: string) => Promise.resolve(queuedDeployments))

        expect(await componentQueueUsecase.execute('dummy-id'))
            .toEqual(queuedDeployments.map(queuedDeployment => queuedDeployment.toReadDto()))
    })
})
