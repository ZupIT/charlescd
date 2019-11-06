import {
  DeploymentEntity,
  UndeploymentEntity
} from '../entity'

export class CreateUndeploymentDto {

  public readonly authorId: string

  public toEntity(deployment: DeploymentEntity): UndeploymentEntity {
    return new UndeploymentEntity(
      this.authorId,
      deployment
    )
  }
}
