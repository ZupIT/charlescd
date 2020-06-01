import { QueuedPipelineStatusEnum } from '../../enums'

export class ReadQueuedIstioDeploymentDto {

  public readonly id: number

  public readonly deploymentId: string

  public readonly componentId: string

  public readonly componentDeploymentId: string

  public readonly circleId: string

  public readonly status: QueuedPipelineStatusEnum

  public readonly createdAt: Date

  constructor(
    id: number,
    deploymentId: string,
    componentId: string,
    componentDeploymentId: string,
    circleId: string,
    status: QueuedPipelineStatusEnum,
    createdAt: Date
  ) {
    this.id = id
    this.deploymentId = deploymentId
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId,
    this.circleId = circleId
    this.status = status
    this.createdAt = createdAt
  }
}
