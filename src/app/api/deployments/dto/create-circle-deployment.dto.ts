import { CircleDeploymentEntity } from '../entity/circle-deployment.entity'

export class CreateCircleDeploymentDto {

  public readonly headerValue: string

  public readonly removeCircle: boolean

  public toEntity(): CircleDeploymentEntity {
    return new CircleDeploymentEntity(
      this.headerValue,
      this.removeCircle
    )
  }
}
