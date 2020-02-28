import {
  BadRequestException,
  Injectable
} from '@nestjs/common'
import { IDeploymentConfiguration } from './interfaces'
import { ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MooveService } from '../moove'
import { ComponentDeploymentsRepository } from '../../../api/deployments/repository'
import { AppConstants } from '../../constants'
import { K8sConfigurationsRepository } from '../../../api/configurations/repository'
import { K8sConfigurationDataEntity } from '../../../api/configurations/entity'

@Injectable()
export class DeploymentConfigurationService {

  constructor(
    private readonly mooveService: MooveService,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(K8sConfigurationsRepository)
    private readonly k8sConfigurationsRepository: K8sConfigurationsRepository
  ) {}

  public async getConfiguration(
    componentDeploymentId: string,
    k8sConfigurationId: string
  ): Promise<IDeploymentConfiguration> {

    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const k8sConfigurationData: K8sConfigurationDataEntity =
      await this.k8sConfigurationsRepository.findDecrypted(k8sConfigurationId)

    if (k8sConfigurationData) {
      return this.getConfigurationObject(k8sConfigurationData, componentDeploymentEntity)
    } else {
      throw new BadRequestException(`Invalid k8s configuration id: ${k8sConfigurationId}`)
    }
  }

  private getConfigurationObject(
    k8sConfigurationData: K8sConfigurationDataEntity,
    componentDeploymentEntity: ComponentDeploymentEntity
  ): IDeploymentConfiguration {

    return {
      account: k8sConfigurationData.account,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${componentDeploymentEntity.moduleDeployment.deployment.applicationName}`,
      appName: componentDeploymentEntity.componentName,
      appNamespace: k8sConfigurationData.namespace,
      healthCheckPath: componentDeploymentEntity.healthCheck,
      uri: {
        uriName: componentDeploymentEntity.contextPath
      },
      appPort: componentDeploymentEntity.port
    }
  }
}
