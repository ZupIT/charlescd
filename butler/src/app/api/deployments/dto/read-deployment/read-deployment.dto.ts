import { ReadModuleDeploymentDto } from './read-module-deployment.dto'
import { ReadCircleDeploymentDto } from './read-circle-deployment.dto'

export class ReadDeploymentDto {

  public readonly id: string

  public readonly applicationName: string

  public readonly modulesDeployments: ReadModuleDeploymentDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly circle: ReadCircleDeploymentDto

  public readonly status: string

  public readonly callbackUrl: string

  public readonly defaultCircle: boolean

  public readonly createdAt: Date

  constructor(
    id: string,
    applicationName: string,
    modulesDeployments: ReadModuleDeploymentDto[],
    authorId: string,
    description: string,
    circle: ReadCircleDeploymentDto,
    status: string,
    callbackUrl: string,
    defaultCircle: boolean,
    createdAt: Date
  ) {
    this.id = id
    this.applicationName = applicationName
    this.modulesDeployments = modulesDeployments
    this.authorId = authorId
    this.description = description
    this.circle = circle
    this.status = status
    this.callbackUrl = callbackUrl
    this.defaultCircle = defaultCircle
    this.createdAt = createdAt
  }
}
