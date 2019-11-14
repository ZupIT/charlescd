import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { QueuedUndeploymentEntity } from '../../../app/api/deployments/entity'

export class PipelineQueuesServiceStub {

    public async getQueuedPipelineStatus(): Promise<QueuedPipelineStatusEnum> {
        return Promise.resolve({} as QueuedPipelineStatusEnum)
    }

    public async enqueueUndeploymentExecution(): Promise<QueuedUndeploymentEntity> {
        return Promise.resolve({} as QueuedUndeploymentEntity)
    }
}
