import { CreateModuleDeploymentDto } from './create-module-deployment.dto'
import { CreateCircleDeploymentDto } from './create-circle-deployment.dto'
import { DeploymentEntity } from '../entity'
import { Type } from 'class-transformer'
import { ValidateNested, Matches, Length, IsNotEmpty } from 'class-validator'

export class CreateDeploymentDto {
  @IsNotEmpty()
  public readonly deploymentId: string

  @Matches(/^[a-zA-Z0-9\-]*$/)
  @Length(1, 59)
  public readonly applicationName: string

  @ValidateNested({ each: true })
  @Type(() => CreateModuleDeploymentDto)
  public readonly modules: CreateModuleDeploymentDto[]

  @IsNotEmpty()
  public readonly authorId: string

  public readonly description: string

  @IsNotEmpty()
  public readonly callbackUrl: string

  @IsNotEmpty()
  public readonly defaultCircle: boolean

  @ValidateNested({ each: true })
  @Type(() => CreateCircleDeploymentDto)
  public readonly circle: CreateCircleDeploymentDto

  public toEntity(circleId: string): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.applicationName,
      this.modules.map(module => module.toEntity()),
      this.authorId,
      this.description,
      this.callbackUrl,
      this.circle.toEntity(),
      this.defaultCircle,
      circleId
    )
  }
}
