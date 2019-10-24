import { Injectable } from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { PipelineQueuesService } from '../../deployments/services'

@Injectable()
export class ComponentsService {

  constructor(
    private readonly queuedDeploymentsService: PipelineQueuesService
  ) {}

  public async getComponentDeploymentQueue(id: string): Promise<ReadQueuedDeploymentDto[]> {
    return this.queuedDeploymentsService.getComponentDeploymentQueue(id)
      .then(queuedDeployments => queuedDeployments.map(
          queuedDeployment => queuedDeployment.toReadDto()
        )
      )
  }
}
