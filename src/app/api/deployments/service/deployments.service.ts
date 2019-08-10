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

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly spinnakerService: SpinnakerService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>
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
    callbackUrl: string
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      await this.componentsRepository.findOne({ componentId: componentDeployment.componentId })
    const deploymentConfiguration: IDeploymentConfiguration =
      await this.deploymentConfigurationService.getConfiguration()

    await this.spinnakerService.createDeployment(
      componentEntity.pipelineOptions,
      deploymentConfiguration,
      callbackUrl
    )
  }

  private async deployRequestedComponents(
    componentDeployments: ComponentDeploymentEntity[],
    callbackUrl: string
  ): Promise<void> {

    await Promise.all(
      componentDeployments.map(
        component => this.deployComponentPipeline(component, callbackUrl)
      )
    )
  }

  private async deployPipelines(deployment: DeploymentEntity) {
    const { callbackUrl } = deployment
    return Promise.all(
      deployment.modules.map(
        module => this.deployRequestedComponents(module.components, callbackUrl)
      )
    )
  }

  public async createDeployment(createDeploymentDto: CreateDeploymentDto): Promise<ReadDeploymentDto> {
    const deployment: DeploymentEntity =
      await this.deploymentsRepository.save(createDeploymentDto.toEntity())

    await this.processDeploymentPipelines(deployment)
    await this.deployPipelines(deployment)

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
    return this.deploymentsRepository.findOne({ id })
      .then(deployment => deployment.toReadDto())
  }

  public async finishDeployment(deploymentId: string, finishDeploymentDto: FinishDeploymentDto): Promise<void> {
    console.log(finishDeploymentDto.status)
    //TODO moove call
  }
}
