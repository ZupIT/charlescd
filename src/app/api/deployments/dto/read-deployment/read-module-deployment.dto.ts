import { ReadComponentDeploymentDto } from './read-component-deployment.dto'

export class ReadModuleDeploymentDto {

  public readonly id: string

  public readonly moduleId: string

  public readonly k8sConfigurationId: string

  public readonly componentsDeployments: ReadComponentDeploymentDto[]

  public readonly status: string

  public readonly createdAt: Date

  constructor(
    id: string,
    moduleId: string,
    k8sConfigurationId: string,
    componentsDeployments: ReadComponentDeploymentDto[],
    status: string,
    createdAt: Date
  ) {
    this.id = id
    this.moduleId = moduleId
    this.k8sConfigurationId = k8sConfigurationId
    this.componentsDeployments = componentsDeployments
    this.status = status
    this.createdAt = createdAt
  }
}
