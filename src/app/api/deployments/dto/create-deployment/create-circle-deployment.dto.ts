import { CircleDeploymentEntity } from '../../entity'
import {
  Allow,
  IsNotEmpty
} from 'class-validator'

export class CreateCircleDeploymentDto {

  @IsNotEmpty()
  public readonly headerValue: string

  @Allow()
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
