import { DeploymentModuleResponse } from '../interface'

export class ReadDeploymentDto {

  public readonly modules: DeploymentModuleResponse[]

  public readonly authorId: string

  public readonly description: string

  public readonly circleHeader: string

  constructor(
    modules: DeploymentModuleResponse[],
    authorId: string,
    description: string,
    circleHeader: string
  ) {
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.circleHeader = circleHeader
  }
}
