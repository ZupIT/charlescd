import { DeploymentModuleRequest } from '../interface'

export class CreateDeploymentDto {

  public readonly modules: DeploymentModuleRequest[]

  public readonly authorId: string

  public readonly description: string

  public readonly callbackUrl: string

  public readonly circleHeader: string

  public toEntity(): Deployment {

  }
}
