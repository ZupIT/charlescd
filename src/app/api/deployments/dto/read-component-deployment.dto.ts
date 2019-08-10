export class ReadComponentDeploymentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly buildImageUrl: string

  public readonly buildImageTag: string

  public readonly status: string

  constructor(
    id: string,
    componentId: string,
    buildImageUrl: string,
    buildImageTag: string,
    status: string
  ) {
    this.id = id
    this.componentId = componentId
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.status = status
  }
}
