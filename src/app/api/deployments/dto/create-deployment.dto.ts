import { CreateModuleDeploymentDto } from './create-module-deployment.dto'
import { CreateCircleDeploymentDto } from './create-circle-deployment.dto'
import { DeploymentEntity } from '../entity'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'

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

  constructor(
      deploymentId: string,
      applicationName: string,
      modules: CreateModuleDeploymentDto[],
      authorId: string,
      description: string,
      callbackUrl: string,
      defaultCircle: boolean,
      circle: CreateCircleDeploymentDto
  ) {
    this.deploymentId = deploymentId
    this.applicationName = applicationName
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.callbackUrl = callbackUrl
    this.defaultCircle = defaultCircle
    this.circle = circle
  }

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
