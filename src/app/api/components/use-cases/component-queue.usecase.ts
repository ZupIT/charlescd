import { BadRequestException, Injectable } from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { ComponentDeploymentEntity, QueuedDeploymentEntity } from '../../deployments/entity'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../../deployments/repository'
import { InjectRepository } from '@nestjs/typeorm'

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
        const componentDeployment: ComponentDeploymentEntity = await this.componentDeploymentRepository.findOne({id: componentDeploymentId })
        if (!componentDeployment) {
            throw new BadRequestException('Component not found')
        }
        const queuedDeployments: QueuedDeploymentEntity[] = await this.queuedDeploymentsRepository.getAllByComponentIdAscending(componentDeploymentId)
        return queuedDeployments.map(
            queuedDeployment => queuedDeployment.toReadDto()
        )
    }
}
