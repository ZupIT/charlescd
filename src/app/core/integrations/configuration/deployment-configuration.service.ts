import { Injectable } from '@nestjs/common'
import {
  IDeploymentConfiguration,
  IK8sConfiguration
} from './interfaces'
import { ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MooveService } from '../moove'
import { ComponentDeploymentsRepository } from '../../../api/deployments/repository'
import { AppConstants } from '../../constants'

@Injectable()
export class DeploymentConfigurationService {

  constructor(
    private readonly mooveService: MooveService,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository
  ) {}

  public async getConfiguration(
    componentDeploymentId: string
  ): Promise<IDeploymentConfiguration> {

    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const k8sConfiguration: IK8sConfiguration =
      await this.mooveService.getK8sConfiguration(componentDeploymentEntity.moduleDeployment.k8sConfigurationId)

    return this.getConfigurationObject(k8sConfiguration, componentDeploymentEntity)
  }

  private getConfigurationObject(
    k8sConfiguration: IK8sConfiguration,
    componentDeploymentEntity: ComponentDeploymentEntity
  ): IDeploymentConfiguration {

    return {
      account: k8sConfiguration.account,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${componentDeploymentEntity.moduleDeployment.deployment.applicationName}`,
      appName: componentDeploymentEntity.componentName,
      appNamespace: k8sConfiguration.namespace,
      healthCheckPath: componentDeploymentEntity.healthCheck,
      uri: {
        uriName: componentDeploymentEntity.contextPath
      },
      appPort: componentDeploymentEntity.port
    }
  }
}
