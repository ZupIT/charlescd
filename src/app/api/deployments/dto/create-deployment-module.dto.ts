import { DeploymentModule } from '../entity/deployment-module.entity'

export class CreateDeploymentModuleDto {

  public readonly moduleId: string

  public readonly buildImageTag: string

  public toEntity(): DeploymentModule {
    return new DeploymentModule(
      this.moduleId,
      this.buildImageTag
    )
  }
}
