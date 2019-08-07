import { DeploymentModule } from '../entity/deployment-module.entity'
import { Deployment } from '../entity/deployment.entity'

export class CreateDeploymentModuleDto {

  public readonly id: string

  public readonly buildImageTag: string

  public toEntity(deployment: Deployment): DeploymentModule {
    return new DeploymentModule(
      deployment,
      this.id,
      this.buildImageTag
    )
  }
}
