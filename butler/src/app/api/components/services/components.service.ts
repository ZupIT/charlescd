import { Injectable } from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { PipelineQueuesService } from '../../deployments/services'

@Injectable()
export class ComponentsService {

  constructor(
    private readonly pipelineQueuesService: PipelineQueuesService
  ) {}

  public async getComponentDeploymentQueue(id: string): Promise<ReadQueuedDeploymentDto[]> {
    return this.pipelineQueuesService.getComponentDeploymentQueue(id)
      .then(queuedDeployments => queuedDeployments.map(
          queuedDeployment => queuedDeployment.toReadDto()
        )
      )
  }
}
