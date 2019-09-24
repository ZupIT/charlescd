import { ComponentDeploymentEntity } from '../entity/component-deployment.entity'

export class CreateComponentDeploymentDto {

  public readonly componentId: string

  public readonly componentName: string

  public readonly buildImageUrl: string

  public readonly buildImageTag: string

  public readonly contextPath: string

  public readonly healthCheck: string

  public readonly port: number

  public toEntity(): ComponentDeploymentEntity {
    return new ComponentDeploymentEntity(
      this.componentId,
      this.componentName,
      this.buildImageUrl,
      this.buildImageTag,
      this.contextPath,
      this.healthCheck,
      this.port
    )
  }
}
