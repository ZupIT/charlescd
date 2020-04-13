import { ComponentDeploymentEntity } from '../../entity'
import {
  Allow,
  IsNotEmpty
} from 'class-validator'

export class CreateComponentDeploymentDto {

  @IsNotEmpty()
  public readonly componentId: string

  @IsNotEmpty()
  public readonly componentName: string

  @IsNotEmpty()
  public readonly buildImageUrl: string

  @IsNotEmpty()
  public readonly buildImageTag: string

  @Allow()
  public readonly contextPath: string

  @Allow()
  public readonly healthCheck: string

  @Allow()
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
