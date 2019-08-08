import { ReadModuleDeploymentDto } from './read-module-deployment.dto'
import { ReadCircleDeploymentDto } from './read-circle-deployment.dto'

export class ReadDeploymentDto {

  public readonly id: string

  public readonly modules: ReadModuleDeploymentDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly circles: ReadCircleDeploymentDto[]

  constructor(
    id: string,
    modules: ReadModuleDeploymentDto[],
    authorId: string,
    description: string,
    circles: ReadCircleDeploymentDto[]
  ) {
    this.id = id
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.circles = circles
  }
}
