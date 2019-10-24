import { QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../enums'

export class ReadQueuedDeploymentDto {

  public readonly id: number

  public readonly componentId: string

  public readonly componentDeploymentId: string

  public readonly status: QueuedPipelineStatusEnum

  public readonly createdAt: Date

  public readonly type: QueuedPipelineTypesEnum

  constructor(
    id: number,
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    createdAt: Date,
    type: QueuedPipelineTypesEnum
  ) {
    this.id = id
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
    this.createdAt = createdAt
    this.type = type
  }
}
