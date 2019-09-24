import { Injectable } from '@nestjs/common'
import { IDeploymentConfiguration } from './interfaces'
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

    const { moduleDeployment } = componentDeploymentEntity
    const { moduleDeployment: { deployment } } = componentDeploymentEntity

    const k8sConfiguration =
      await this.mooveService.getK8sConfiguration(moduleDeployment.k8sConfigurationId)

    return {
      account: k8sConfiguration.account,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: deployment.valueFlowId,
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
