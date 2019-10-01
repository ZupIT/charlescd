import { Injectable } from '@nestjs/common'
import { ComponentDeploymentEntity } from '../entity'
import { ComponentEntity } from '../../components/entity'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentStatusEnum } from '../enums'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { ConsoleLoggerService } from '../../../core/logs/console'
import {ComponentDeploymentsRepository} from '../repository'

@Injectable()
export class PipelineDeploymentService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository
  ) {}

  private async deployComponentPipeline(
    componentDeployment: ComponentDeploymentEntity,
    deploymentId: string
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      await this.componentsRepository.findOne({ id: componentDeployment.componentId })

    const deploymentConfiguration: IDeploymentConfiguration =
      await this.deploymentConfigurationService.getConfiguration(componentDeployment.id)

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
        await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    await this.deployComponent(componentDeploymentEntity)
    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
  }
}
