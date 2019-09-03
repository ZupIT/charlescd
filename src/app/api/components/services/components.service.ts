import { Injectable } from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { QueuedDeploymentsService } from '../../deployments/services'

@Injectable()
export class ComponentsService {

  constructor(
    private readonly queuedDeploymentsService: QueuedDeploymentsService
  ) {}

  public async getComponentDeploymentQueue(id: string): Promise<ReadQueuedDeploymentDto[]> {
    return this.queuedDeploymentsService.getComponentDeploymentQueue(id)
      .then(queuedDeployments => queuedDeployments.map(
          queuedDeployment => queuedDeployment.toReadDto()
        )
      )
  }
}
