import { ReadModuleDeploymentDto } from './read-module-deployment.dto'
import { ReadCircleDeploymentDto } from './read-circle-deployment.dto'

export class ReadDeploymentDto {

  public readonly id: string

  public readonly modules: ReadModuleDeploymentDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly circles: ReadCircleDeploymentDto[]

  public readonly status: string

  constructor(
    id: string,
    modules: ReadModuleDeploymentDto[],
    authorId: string,
    description: string,
    circles: ReadCircleDeploymentDto[],
    status: string
  ) {
    this.id = id
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.circles = circles
    this.status = status
  }
}
