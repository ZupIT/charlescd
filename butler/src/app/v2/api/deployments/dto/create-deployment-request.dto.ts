import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity';
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums';

export class CreateDeploymentRequestDto {
  public deploymentId: string
  public authorId: string
  public callbackUrl: string
  public cdConfigurationId: string
  public circleId: string | null
  public status: DeploymentStatusEnum
  public modules: []
  public cdConfiguration?: CdConfigurationEntity // to be filled by some pipe? dont know, maybe

  constructor(deploymentId: string, authorId: string, callbackUrl: string, cdConfigurationId: string, circleId: string | null, status: DeploymentStatusEnum, modules: []) {
    this.deploymentId = deploymentId
    this.authorId = authorId
    this.callbackUrl = callbackUrl
    this.cdConfigurationId = cdConfigurationId
    this.circleId = circleId
    this.status = status
    this.modules = modules
  }

}
