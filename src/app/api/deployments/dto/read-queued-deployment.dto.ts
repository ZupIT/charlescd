import { QueuedDeploymentStatusEnum } from '../enums'

export class ReadQueuedDeploymentDto {

  public readonly id: number

  public readonly componentId: string

  public readonly componentDeploymentId: string

  public readonly status: QueuedDeploymentStatusEnum

  public readonly createdAt: Date

  constructor(
    id: number,
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum,
    createdAt: Date
  ) {
    this.id = id
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
    this.createdAt = createdAt
  }
}
