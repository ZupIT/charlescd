export class ReadComponentDeploymentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly componentName: string

  public readonly buildImageUrl: string

  public readonly buildImageTag: string

  public readonly contextPath: string

  public readonly healthCheck: string

  public readonly port: number

  public readonly status: string

  public readonly createdAt: Date

  constructor(
    id: string,
    componentId: string,
    componentName: string,
    buildImageUrl: string,
    buildImageTag: string,
    contextPath: string,
    healthCheck: string,
    port: number,
    status: string,
    createdAt: Date
  ) {
    this.id = id
    this.componentId = componentId
    this.componentName = componentName
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.contextPath = contextPath
    this.healthCheck = healthCheck
    this.port = port
    this.status = status
    this.createdAt = createdAt
  }
}
