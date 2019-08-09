import { ComponentDeploymentEntity } from '../entity/component-deployment.entity'

export class CreateComponentDeploymentDto {

  public readonly componentId: string

  public readonly buildImageTag: string

  public readonly buildImageName: string

  public toEntity(): ComponentDeploymentEntity {
    return new ComponentDeploymentEntity(
      this.componentId,
      this.buildImageTag,
      this.buildImageName
    )
  }
}
