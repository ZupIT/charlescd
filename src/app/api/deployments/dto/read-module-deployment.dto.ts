import { ReadComponentDeploymentDto } from './read-component-deployment.dto'

export class ReadModuleDeploymentDto {

  public readonly id: string

  public readonly moduleId: string

  public readonly components: ReadComponentDeploymentDto[]

  constructor(
    id: string,
    moduleId: string,
    components: ReadComponentDeploymentDto[]
  ) {
    this.id = id
    this.moduleId = moduleId
    this.components = components
  }
}
