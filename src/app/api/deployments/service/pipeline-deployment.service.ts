import { Injectable } from '@nestjs/common'
import { ComponentDeploymentEntity, DeploymentEntity } from '../entity'
import { ComponentEntity } from '../../modules/entity'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentStatusEnum } from '../enums'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { SpinnakerService } from '../../../core/integrations/spinnaker'

@Injectable()
export class PipelineDeploymentService {

  constructor(
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
  ) {}

  private async deployComponentPipeline(
    componentDeployment: ComponentDeploymentEntity,
    deploymentId: string
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      await this.componentsRepository.findOne({ componentId: componentDeployment.componentId })
    const deploymentConfiguration: IDeploymentConfiguration =
      await this.deploymentConfigurationService.getConfiguration(componentEntity.componentId)

    await this.spinnakerService.createDeployment(
      componentEntity.pipelineOptions,
      deploymentConfiguration,
      componentDeployment.id,
      deploymentId
    )
  }

  private async deployRequestedComponents(
    componentDeployments: ComponentDeploymentEntity[],
    deploymentId: string
  ): Promise<void> {

    await Promise.all(
      componentDeployments.map(
        component => this.deployComponentPipeline(component, deploymentId)
      )
    )
  }

  private async deployPipelines(deployment: DeploymentEntity) {
    return Promise.all(
      deployment.modules.map(
        module => this.deployRequestedComponents(module.components, deployment.id)
      )
    )
  }

  public async deployRequestedPipelines(deployment: DeploymentEntity): Promise<void> {
    try {
      await this.deployPipelines(deployment)
    } catch (error) {
      await this.deploymentsStatusManagementService
        .deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
      throw error
    }
  }
}
