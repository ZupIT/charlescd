import { CircleDeploymentEntity } from '../../entity'
import {
  Allow,
  IsNotEmpty
} from 'class-validator'

export class CreateCircleDeploymentDto {

  @IsNotEmpty()
  public readonly headerValue: string

  constructor(
      headerValue: string
  ) {
    this.headerValue = headerValue
  }

  public toEntity(): CircleDeploymentEntity {
    return new CircleDeploymentEntity(
      this.headerValue
    )
  }
}
