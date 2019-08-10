import { ReadComponentDeploymentDto } from './read-component-deployment.dto'

export class ReadModuleDeploymentDto {

  public readonly id: string

  public readonly moduleId: string

  public readonly components: ReadComponentDeploymentDto[]

  public readonly status: string

  constructor(
    id: string,
    moduleId: string,
    components: ReadComponentDeploymentDto[],
    status: string
  ) {
    this.id = id
    this.moduleId = moduleId
    this.components = components
    this.status = status
  }
}
