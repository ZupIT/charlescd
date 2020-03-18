import {
  BadRequestException,
  Injectable
} from '@nestjs/common'
import { IDeploymentConfiguration } from './interfaces'
import { ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentDeploymentsRepository } from '../../../api/deployments/repository'
import { AppConstants } from '../../constants'
import { CdConfigurationsRepository } from '../../../api/configurations/repository'
import {
  ICdConfigurationData,
  ISpinnakerConfigurationData
} from '../../../api/configurations/interfaces'

@Injectable()
export class DeploymentConfigurationService {

  constructor(
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(CdConfigurationsRepository)
    private readonly cdConfigurationsRepository: CdConfigurationsRepository
  ) {}

  public async getConfiguration(
    componentDeploymentId: string,
    k8sConfigurationId: string
  ): Promise<IDeploymentConfiguration> {

    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const cdConfigurationData =
      await this.cdConfigurationsRepository.findDecrypted(k8sConfigurationId)

    if (cdConfigurationData) {
      return this.getConfigurationObject(cdConfigurationData, componentDeploymentEntity)
    } else {
      throw new BadRequestException(`Invalid k8s configuration id: ${k8sConfigurationId}`)
    }
  }

  private getConfigurationObject(
    cdConfigurationData,
    componentDeploymentEntity: ComponentDeploymentEntity
  ): IDeploymentConfiguration {

    return {
      account: cdConfigurationData.account,
      appNamespace: cdConfigurationData.namespace,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${componentDeploymentEntity.moduleDeployment.deployment.applicationName}`,
      appName: componentDeploymentEntity.componentName,
      healthCheckPath: componentDeploymentEntity.healthCheck,
      uri: {
        uriName: componentDeploymentEntity.contextPath
      },
      appPort: componentDeploymentEntity.port
    }
  }
}
