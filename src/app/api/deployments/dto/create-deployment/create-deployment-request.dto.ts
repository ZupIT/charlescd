import { CreateModuleDeploymentDto } from '../index'
import { Type } from 'class-transformer'
import {
  Allow,
  IsDefined,
  IsNotEmpty,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'

export abstract class CreateDeploymentRequestDto {

  @IsNotEmpty()
  public deploymentId: string

  @Matches(/^[a-zA-Z0-9\-]*$/)
  @Length(1, 59)
  public applicationName: string

  @ValidateNested({ each: true })
  @Type(() => CreateModuleDeploymentDto)
  public modules: CreateModuleDeploymentDto[]

  @IsNotEmpty()
  public authorId: string

  @IsDefined()
  public description: string

  @IsNotEmpty()
  public callbackUrl: string
}
