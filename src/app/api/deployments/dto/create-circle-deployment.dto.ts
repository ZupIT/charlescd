import { CircleDeployment } from '../entity/circle-deployment.entity'

export class CreateCircleDeploymentDto {

  public readonly headerValue: string

  public readonly removeCircle: boolean

  public toEntity(): CircleDeployment {
    return new CircleDeployment(
      this.headerValue,
      this.removeCircle
    )
  }
}
