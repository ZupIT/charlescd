export class ReadCircleDeploymentDto {

  public readonly headerValue: string

  public readonly removeCircle: boolean

  constructor(
    headerValue: string,
    removeCircle: boolean
  ) {
    this.headerValue = headerValue
    this.removeCircle = removeCircle
  }
}
