import { ReadCircleDeploymentDto } from '../dto/read-circle-deployment.dto'

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

  public toReadDto(): ReadCircleDeploymentDto {
    return new ReadCircleDeploymentDto(
      this.headerValue,
      this.removeCircle
    )
  }
}
