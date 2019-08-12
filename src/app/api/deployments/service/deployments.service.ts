import { Injectable } from '@nestjs/common'
import { CreateDeploymentDto, ReadDeploymentDto } from '../dto'
import { FinishDeploymentDto } from '../../notifications/dto'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentEntity, ModuleEntity } from '../../modules/entity'
import { IPipelineOptions } from '../../modules/interfaces'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { DeploymentStatusEnum } from '../enums'
import { NotificationStatusEnum } from '../../notifications/enums'
import { DeploymentsStatusManagementService } from './deployments-status-management-service'
import { MooveService } from '../../../core/integrations/moove'

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly spinnakerService: SpinnakerService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly mooveService: MooveService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>
  ) {}

  private async createModuleComponent(
    moduleEntity: ModuleEntity,
    componentDeployment: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    const pipelineOptions: IPipelineOptions =
      this.spinnakerService.createNewPipelineOptions(circles, componentDeployment)

    return moduleEntity.addComponent(new ComponentEntity(
      componentDeployment.componentId,
      pipelineOptions
    ))
  }

  private getComponentEntitiesFromDeployments(
    componentDeployments: ComponentDeploymentEntity[],
    circles: CircleDeploymentEntity[]
  ): ComponentEntity[] {

    return componentDeployments.map(
      component => new ComponentEntity(
        component.componentId,
        this.spinnakerService.createNewPipelineOptions(circles, component)
      )
    )
  }

  private async createModulePipelines(
    moduleDeploymentEntity: ModuleDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    return this.modulesRepository.save(new ModuleEntity(
      moduleDeploymentEntity.moduleId,
      this.getComponentEntitiesFromDeployments(moduleDeploymentEntity.components, circles)
    ))
  }

  private async updateComponentPipeline(
    componentEntity: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    const pipelineOptions: IPipelineOptions = this.spinnakerService.updatePipelineOptions(
      componentEntity.pipelineOptions, circles, componentDeployment
    )
    return componentEntity.updatePipelineOptions(pipelineOptions)
  }

  private async updateModuleComponentsPipelines(
    moduleEntity: ModuleEntity,
    moduleDeploymentEntity: ModuleDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    for (const componentDeployment of moduleDeploymentEntity.components) {
      const componentEntity: ComponentEntity =
        moduleEntity.getComponentById(componentDeployment.componentId)

      componentEntity ?
        await this.updateComponentPipeline(componentEntity, componentDeployment, circles) :
        await this.createModuleComponent(moduleEntity, componentDeployment, circles)
    }
  }

  private async updateModulePipelines(
    moduleEntity: ModuleEntity,
    moduleDeploymentEntity: ModuleDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    await this.updateModuleComponentsPipelines(moduleEntity, moduleDeploymentEntity, circles)
    return this.modulesRepository.save(moduleEntity)
  }

  private async processModulePipelines(
    moduleDeploymentEntity: ModuleDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ moduleId: moduleDeploymentEntity.moduleId })

    return moduleEntity ?
      this.updateModulePipelines(moduleEntity, moduleDeploymentEntity, circles) :
      this.createModulePipelines(moduleDeploymentEntity, circles)
  }

  private async processDeploymentPipelines(deployment: DeploymentEntity) {
    const { circles, modules } = deployment
    return Promise.all(
      modules.map(module => this.processModulePipelines(module, circles))
    )
  }

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

  public async createDeployment(createDeploymentDto: CreateDeploymentDto): Promise<ReadDeploymentDto> {
    const deployment: DeploymentEntity =
      await this.deploymentsRepository.save(createDeploymentDto.toEntity())

    await this.processDeploymentPipelines(deployment)
    await this.deployRequestedPipelines(deployment)
    return deployment.toReadDto()
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
  }
}
