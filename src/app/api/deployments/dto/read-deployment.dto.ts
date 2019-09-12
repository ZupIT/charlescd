import { ReadModuleDeploymentDto } from './read-module-deployment.dto'
import { ReadCircleDeploymentDto } from './read-circle-deployment.dto'

export class ReadDeploymentDto {

  public readonly id: string

  public readonly modules: ReadModuleDeploymentDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly circles: ReadCircleDeploymentDto[]

  public readonly status: string

  public readonly callbackUrl: string

  public readonly defaultCircle: boolean

  public readonly createdAt: Date

  constructor(
    id: string,
    modules: ReadModuleDeploymentDto[],
    authorId: string,
    description: string,
    circles: ReadCircleDeploymentDto[],
    status: string,
    callbackUrl: string,
    defaultCircle: boolean,
    createdAt: Date
  ) {
    this.id = id
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.circles = circles
    this.status = status
    this.callbackUrl = callbackUrl
    this.defaultCircle = defaultCircle
    this.createdAt = createdAt
  }
}
