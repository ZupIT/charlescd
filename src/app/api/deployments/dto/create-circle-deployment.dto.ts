import { CircleDeploymentEntity } from '../entity'

export class CreateCircleDeploymentDto {

  public readonly headerValue: string

  public readonly removeCircle: boolean

  constructor(
      headerValue: string,
      removeCircle: boolean
  ) {
    this.headerValue = headerValue
    this.removeCircle = removeCircle
  }

  public toEntity(): CircleDeploymentEntity {
    return new CircleDeploymentEntity(
      this.headerValue,
      this.removeCircle
    )
  }
}
