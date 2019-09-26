import { Injectable } from '@nestjs/common'
import { IDeploymentConfiguration, IK8sConfiguration } from './interfaces'
import { ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MooveService } from '../moove'

@Injectable()
export class DeploymentConfigurationService {

  constructor(
    private readonly mooveService: MooveService,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>
  ) {}

  public async getConfiguration(
    componentDeploymentId: string
  ): Promise<IDeploymentConfiguration> {

    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    const k8sConfiguration: IK8sConfiguration = await this.mooveService.getK8sConfiguration(
      componentDeploymentEntity.moduleDeployment.k8sConfigurationId
    )

    return this.getConfigurationObject(k8sConfiguration, componentDeploymentEntity)
  }

  private getConfigurationObject(
    k8sConfiguration: IK8sConfiguration,
    componentDeploymentEntity: ComponentDeploymentEntity
  ): IDeploymentConfiguration {

    return {
      account: k8sConfiguration.account,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: componentDeploymentEntity.moduleDeployment.deployment.valueFlowId,
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
