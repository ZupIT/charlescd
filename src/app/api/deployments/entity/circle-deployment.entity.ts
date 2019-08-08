export class CircleDeployment {

  public headerValue: string

  public removeCircle: boolean

  constructor(
    headerValue: string,
    removeCircle: boolean
  ) {
    this.headerValue = headerValue
    this.removeCircle = removeCircle
  }
}
