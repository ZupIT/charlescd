import {
  DeploymentEntity,
  UndeploymentEntity
} from '../entity'
import { Allow } from 'class-validator'

export class CreateUndeploymentDto {

  @Allow()
  public readonly authorId: string

  constructor(
      authorId: string
  ) {
    this.authorId = authorId
  }

  public toEntity(deployment: DeploymentEntity): UndeploymentEntity {
    return new UndeploymentEntity(
      this.authorId,
      deployment
    )
  }
}
