import {Injectable} from '@nestjs/common'
import {PipelineQueuesService} from '../../deployments/services'
import {ReadQueuedDeploymentDto} from '../../deployments/dto'

@Injectable()
export class ComponentQueueUseCase {
    constructor(private readonly pipelineQueuesService: PipelineQueuesService) {
    }

    public async execute(id: string): Promise<ReadQueuedDeploymentDto[]> {
        return this.pipelineQueuesService.getComponentDeploymentQueue(id).
        then(queuedDeployments => queuedDeployments.map(queuedDeployment => queuedDeployment.toReadDto()))
    }

}
