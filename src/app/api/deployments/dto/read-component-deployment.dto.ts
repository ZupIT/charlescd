export class ReadComponentDeploymentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly buildImageUrl: string

  public readonly buildImageTag: string

  constructor(
    id: string,
    componentId: string,
    buildImageUrl: string,
    buildImageTag: string
  ) {
    this.id = id
    this.componentId = componentId
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
  }
}
