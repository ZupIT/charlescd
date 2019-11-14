import { UndeploymentStatusEnum } from '../enums'
import { ReadModuleUndeploymentDto } from './read-module-undeployment.dto'

export class ReadUndeploymentDto {

  public readonly id: string

  public readonly authorId: string

  public readonly createdAt: Date

  public readonly deployment: string

  public readonly status: UndeploymentStatusEnum

  public readonly modulesUndeployments: ReadModuleUndeploymentDto[]

  constructor(
    id: string,
    authorId: string,
    createdAt: Date,
    deployment: string,
    status: UndeploymentStatusEnum,
    modulesUndeployments: ReadModuleUndeploymentDto[]
  ) {
    this.id = id
    this.authorId = authorId
    this.createdAt = createdAt
    this.deployment = deployment
    this.status = status
    this.modulesUndeployments = modulesUndeployments
  }
}
