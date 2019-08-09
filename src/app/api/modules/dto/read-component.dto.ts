export class ReadComponentDto {

  public readonly id: string

  public readonly componentId: string

  constructor(
    id: string,
    componentId: string
  ) {
    this.id = id
    this.componentId = componentId
  }
}
