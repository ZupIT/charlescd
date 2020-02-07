import { QueuedDeploymentEntity } from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { ComponentQueueUseCase } from '../../../app/api/components/use-cases/component-queue.usecase'
import { Test } from '@nestjs/testing'
import { QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import { QueuedDeploymentsRepositoryStub } from '../../stubs/repository'
import { PipelineQueuesService } from '../../../app/api/deployments/services'
import { PipelineQueuesServiceStub } from '../../stubs/services'
import {BadRequestException, InternalServerErrorException} from '@nestjs/common'

describe('execute', () => {

        let queuedDeploymentsRepository: QueuedDeploymentsRepository
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
                providers: [ComponentQueueUseCase, {
                        provide: PipelineQueuesService,
                        useClass: PipelineQueuesServiceStub,
                    },
                    {
                        provide: QueuedDeploymentsRepository,
                        useClass: QueuedDeploymentsRepositoryStub
                    }]
            }).compile()

            componentQueueUsecase = module.get<ComponentQueueUseCase>(ComponentQueueUseCase)
            queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        })

        it('should return a exception when dont found any component', async () => {
            jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdAscending')
                .mockImplementation(() => Promise.resolve(undefined))

            await expect(componentQueueUsecase.execute('dummy-id'))
                .rejects.toThrowError(BadRequestException)
        })

        it('should return a list of dto queued pipelines', async () => {
            jest.spyOn(queuedDeploymentsRepository, 'getAllByComponentIdAscending')
                .mockImplementation(() => Promise.resolve(queuedDeployments))

            expect(await componentQueueUsecase.execute('dummy-id'))
                .toEqual(queuedDeployments.map(queuedDeployment => queuedDeployment.toReadDto()))
        })
    }
)
