import { CreateDeploymentModuleDto } from './create-deployment-module.dto'
import { Deployment } from '../entity/deployment.entity'

export class CreateDeploymentDto {

  public readonly modules: CreateDeploymentModuleDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly callbackUrl: string

  public readonly circleHeader: string

  public toEntity(): Deployment {
    return new Deployment(
      this.authorId,
      this.description,
      this.callbackUrl,
      this.circleHeader
    )
  }
}
