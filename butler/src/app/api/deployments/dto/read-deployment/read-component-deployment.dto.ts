export class ReadComponentDeploymentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly componentName: string

  public readonly buildImageUrl: string

  public readonly buildImageTag: string

  public readonly status: string

  public readonly createdAt: Date

  constructor(
    id: string,
    componentId: string,
    componentName: string,
    buildImageUrl: string,
    buildImageTag: string,
    status: string,
    createdAt: Date
  ) {
    this.id = id
    this.componentId = componentId
    this.componentName = componentName
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.status = status
    this.createdAt = createdAt
  }
}
