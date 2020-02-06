import {Injectable} from '@nestjs/common'
import {PipelineQueuesService} from '../../deployments/services'
import {ReadQueuedDeploymentDto} from '../../deployments/dto'
import {QueuedDeploymentEntity} from '../../deployments/entity'
import {QueuedDeploymentsRepository} from '../../deployments/repository'

@Injectable()
export class ComponentQueueUseCase {
    constructor(private readonly pipelineQueuesService: PipelineQueuesService,
                private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository
    ) {}

    public async execute(id: string): Promise<ReadQueuedDeploymentDto[]> {
        return this.getComponentDeploymentQueue(id).
        then(queuedDeployments => queuedDeployments.map(
             queuedDeployment => queuedDeployment.toReadDto()
            )
        )
    }
    public async getComponentDeploymentQueue(
        componentId: string
    ): Promise<QueuedDeploymentEntity[]> {

        return this.queuedDeploymentsRepository.getAllByComponentIdAscending(componentId)
    }

}
