import { ComponentDeploymentEntity } from '../../entity'
import {
  IsDefined,
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
