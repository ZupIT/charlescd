import { ComponentDeploymentEntity } from '../../entity'
import { IsNotEmpty } from 'class-validator'

export class CreateComponentDeploymentDto {

  @IsNotEmpty()
  public readonly componentId: string

  @IsNotEmpty()
  public readonly componentName: string

  @IsNotEmpty()
  public readonly buildImageUrl: string

  @IsNotEmpty()
  public readonly buildImageTag: string

  public toEntity(): ComponentDeploymentEntity {
    return new ComponentDeploymentEntity(
      this.componentId,
      this.componentName,
      this.buildImageUrl,
      this.buildImageTag
    )
  }
}
