import { Injectable } from '@nestjs/common'
import { CreateDeploymentDto, ReadDeploymentDto } from '../dto'
import { FinishDeploymentDto } from '../../notifications/dto'
import { ComponentDeploymentEntity, DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentEntity, ModuleEntity } from '../../modules/entity'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { DeploymentStatusEnum } from '../enums'
import { NotificationStatusEnum } from '../../notifications/enums'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'
import { MooveService } from '../../../core/integrations/moove'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { QueuedDeploymentsService } from './queued-deployments.service'

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly spinnakerService: SpinnakerService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly mooveService: MooveService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly queuedDeploymentsService: QueuedDeploymentsService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
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

  private async deployRequestedPipelines(deployment: DeploymentEntity): Promise<void> {
    try {
      await this.deployPipelines(deployment)
    } catch (error) {
      await this.deploymentsStatusManagementService
        .deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
      throw error
    }
  }

  private async createDeploymentEntity(createDeploymentDto: CreateDeploymentDto): Promise<DeploymentEntity> {
    const deployment: DeploymentEntity =
      await this.deploymentsRepository.save(createDeploymentDto.toEntity())
    return deployment
  }

  public async createDeployment(createDeploymentDto: CreateDeploymentDto): Promise<ReadDeploymentDto> {
    this.consoleLoggerService.log(`START:CREATE_DEPLOYMENT`, createDeploymentDto)
    const deployment: DeploymentEntity = await this.createDeploymentEntity(createDeploymentDto)

    // await this.processDeploymentPipelines(deployment)
    // await this.deployRequestedPipelines(deployment)

    await this.queuedDeploymentsService.queueDeploymentTasks(deployment)

    const deploymentReadDto: ReadDeploymentDto = deployment.toReadDto()
    this.consoleLoggerService.log(`FINISH:CREATE_DEPLOYMENT`, deploymentReadDto)

    return deploymentReadDto
  }

  private async convertDeploymentsToReadDto(deployments: DeploymentEntity[]): Promise<ReadDeploymentDto[]> {
    return deployments.map(deployment => deployment.toReadDto())
  }

  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return this.deploymentsRepository.find({ relations: ['modules'] })
      .then(deployments => this.convertDeploymentsToReadDto(deployments))
  }

  public async getDeploymentById(id: string): Promise<ReadDeploymentDto> {
    return this.deploymentsRepository.findOne({where: { id }, relations: ['modules']})
      .then(deployment => deployment.toReadDto())
  }

  public async finishDeployment(
    componentDeploymentId: string,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)

    const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentRepository.findOne({
            where: {id: componentDeploymentId},
            relations: ['moduleDeployment', 'moduleDeployment.deployment']
          })

    let status = DeploymentStatusEnum.FAILED

    if (finishDeploymentDto &&
        finishDeploymentDto.status &&
        finishDeploymentDto.status === NotificationStatusEnum.SUCCEEDED) {

      status = DeploymentStatusEnum.FINISHED
    }

    const deployment: DeploymentEntity =
        await this.deploymentsRepository.findOne({
          where: { id: componentDeployment.moduleDeployment.deployment.id },
          relations: ['modules']
        })

    this.deploymentsStatusManagementService.deepUpdateDeploymentStatus(deployment, status)

    await this.mooveService.notifyDeploymentStatus(deployment.id, finishDeploymentDto.status, deployment.callbackUrl)

    this.consoleLoggerService.log('FINISH:FINISH_DEPLOYMENT_NOTIFICATION')
  }
}
