import { DeploymentModuleResponse } from '../interface'

export class ReadDeploymentDto {

  public readonly id: string

  public readonly modules: DeploymentModuleResponse[]

  public readonly authorId: string

  public readonly description: string

  public readonly circleHeader: string

  constructor(
    id: string,
    modules: DeploymentModuleResponse[],
    authorId: string,
    description: string,
    circleHeader: string
  ) {
    this.id = id
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.circleHeader = circleHeader
  }
}
