import { BadRequestException, Injectable } from '@nestjs/common'
import { PipelineQueuesService } from '../../deployments/services'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { QueuedDeploymentEntity } from '../../deployments/entity'
import { QueuedDeploymentsRepository } from '../../deployments/repository'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ComponentQueueUseCase {
    constructor(
        private readonly pipelineQueuesService: PipelineQueuesService,
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository
    ) {
    }

    public async execute(id: string): Promise<ReadQueuedDeploymentDto[]> {
        const queuedDeployments: QueuedDeploymentEntity[] = await this.queuedDeploymentsRepository.getAllByComponentIdAscending(id)
        if ( !queuedDeployments ) {
            throw new BadRequestException('No results found for this component')
        }
        return queuedDeployments.map(
            queuedDeployment => queuedDeployment.toReadDto()
        )
    }
}
