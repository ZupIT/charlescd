import { CreateDeploymentModuleDto } from './create-deployment-module.dto'
import { Deployment } from '../entity/deployment.entity'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class CreateDeploymentDto {

  @ValidateNested({ each: true })
  @Type(() => CreateDeploymentModuleDto)
  public readonly modules: CreateDeploymentModuleDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly callbackUrl: string

  public readonly circleHeader: string

  public toEntity(): Deployment {
    return new Deployment(
      this.modules.map(module => module.toEntity()),
      this.authorId,
      this.description,
      this.callbackUrl,
      this.circleHeader
    )
  }
}
