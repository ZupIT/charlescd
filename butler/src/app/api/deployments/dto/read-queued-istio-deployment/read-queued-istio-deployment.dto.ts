import { QueuedPipelineStatusEnum } from '../../enums'

export class ReadQueuedIstioDeploymentDto {

  public readonly id: number

  public readonly deploymentId: string

  public readonly circleId: string

  public readonly status: QueuedPipelineStatusEnum

  public readonly createdAt: Date

  constructor(
    id: number,
    deploymentId: string,
    circleId: string,
    status: QueuedPipelineStatusEnum,
    createdAt: Date
  ) {
    this.id = id
    this.deploymentId = deploymentId
    this.circleId = circleId
    this.status = status
    this.createdAt = createdAt
  }
}
