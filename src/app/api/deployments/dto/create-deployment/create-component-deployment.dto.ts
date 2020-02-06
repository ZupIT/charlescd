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

  @IsNotEmpty()
  public readonly contextPath: string

  @IsNotEmpty()
  public readonly healthCheck: string

  @IsDefined()
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
