import { Injectable } from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../../deployments/repository'
import { InjectRepository } from '@nestjs/typeorm'
import { QueuedDeploymentEntity } from '../../deployments/entity'

@Injectable()
export class ComponentQueueUseCase {
    constructor(
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentRepository: ComponentDeploymentsRepository
    ) {
    }

    public async execute(componentDeploymentId: string): Promise<ReadQueuedDeploymentDto[]> {
        const queuedDeployments: QueuedDeploymentEntity[]  = await this.queuedDeploymentsRepository
            .getAllByComponentIdAscending(componentDeploymentId)
        return queuedDeployments.map(
            queuedDeployment => queuedDeployment.toReadDto()
        )
    }
}
