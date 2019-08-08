export class ReadComponentDeploymentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly buildImageTag: string

  public readonly buildImageName: string

  constructor(
    id: string,
    componentId: string,
    buildImageTag: string,
    buildImageName: string
  ) {
    this.id = id
    this.componentId = componentId
    this.buildImageTag = buildImageTag
    this.buildImageName = buildImageName
  }
}
