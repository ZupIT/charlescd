import { ReadCircleDeploymentDto } from '../dto'

export class CircleDeploymentEntity {

  public headerValue: string

  constructor(
    headerValue: string
  ) {
    this.headerValue = headerValue
  }

  public toReadDto(): ReadCircleDeploymentDto {
    return new ReadCircleDeploymentDto(
      this.headerValue
    )
  }
}
