import { Injectable } from '@nestjs/common'
import { ComponentDeploymentEntity, QueuedDeploymentEntity } from '../entity'
import { ComponentEntity } from '../../modules/entity'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentStatusEnum } from '../enums'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { ConsoleLoggerService } from '../../../core/logs/console'

@Injectable()
export class PipelineDeploymentService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>
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

  public async deployComponent(componentDeploymentEntity: ComponentDeploymentEntity): Promise<void> {
    try {
      const { moduleDeployment: { deployment: { id: deploymentId } } } = componentDeploymentEntity
      await this.deployComponentPipeline(componentDeploymentEntity, deploymentId)
    } catch (error) {
      const { moduleDeployment: { deployment } } = componentDeploymentEntity
      await this.deploymentsStatusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
      throw error
    }
  }

  public async processDeployment(componentDeploymentId: string): Promise<void> {
    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    await this.deployComponent(componentDeploymentEntity)
    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
  }
}
