import { UndeploymentStatusEnum } from '../enums'

export class ReadUndeploymentDto {

  public readonly id: string

  public readonly authorId: string

  public readonly createdAt: Date

  public readonly deployment: string

  public readonly status: UndeploymentStatusEnum

  constructor(
    id: string,
    authorId: string,
    createdAt: Date,
    deployment: string,
    status: UndeploymentStatusEnum
  ) {
    this.id = id
    this.authorId = authorId
    this.createdAt = createdAt
    this.deployment = deployment
    this.status = status
  }
}
