import { ReadComponentDeploymentDto } from './read-component-deployment.dto'

export class ReadModuleDeploymentDto {

  public readonly id: string

  public readonly moduleId: string

  public readonly components: ReadComponentDeploymentDto[]

  public readonly status: string

  public readonly createdAt: Date

  constructor(
    id: string,
    moduleId: string,
    components: ReadComponentDeploymentDto[],
    status: string,
    createdAt: Date
  ) {
    this.id = id
    this.moduleId = moduleId
    this.components = components
    this.status = status
    this.createdAt = createdAt
  }
}
