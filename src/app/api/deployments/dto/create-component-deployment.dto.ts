import { ComponentDeployment } from '../entity/component-deployment.entity'

export class CreateComponentDeploymentDto {

  public readonly componentId: string

  public readonly buildImageTag: string

  public readonly buildImageName: string

  public toEntity(): ComponentDeployment {
    return new ComponentDeployment(
      this.componentId,
      this.buildImageTag,
      this.buildImageName
    )
  }
}
