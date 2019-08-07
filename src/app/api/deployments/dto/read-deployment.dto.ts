import { DeploymentModuleRequest } from '../interface/deployment-module-request.interface'

export class ReadDeploymentDto {

  public readonly modules: DeploymentModuleRequest[]

  public readonly authorId: string

  public readonly description: string

  public readonly circleId: string
}
