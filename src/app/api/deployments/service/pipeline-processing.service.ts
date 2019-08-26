import { Injectable } from '@nestjs/common'
import { ComponentEntity, ModuleEntity } from '../../modules/entity'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../entity'
import { IPipelineOptions } from '../../modules/interfaces'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PipelineProcessingService {

  constructor(
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
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

  private getCreateModuleComponentDeployments(
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ): ComponentEntity[] {

    return [
      new ComponentEntity(
        componentDeploymentEntity.componentId,
        this.spinnakerService.createNewPipelineOptions(circles, componentDeploymentEntity)
      )
    ]
  }

  private async createModuleEntity(
    moduleDeploymentEntity: ModuleDeploymentEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    return this.modulesRepository.save(
      new ModuleEntity(
        moduleDeploymentEntity.moduleId,
        this.getCreateModuleComponentDeployments(componentDeploymentEntity, circles)
      )
    )
  }

  private async updateComponentPipelineObject(
    componentEntity: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    const pipelineOptions: IPipelineOptions = this.spinnakerService.updatePipelineOptions(
      componentEntity.pipelineOptions, circles, componentDeployment
    )
    return componentEntity.updatePipelineOptions(pipelineOptions)
  }

  private async updateModuleComponentPipeline(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      moduleEntity.getComponentById(componentDeploymentEntity.componentId)

    componentEntity ?
      await this.updateComponentPipelineObject(componentEntity, componentDeploymentEntity, circles) :
      await this.createModuleComponent(moduleEntity, componentDeploymentEntity, circles)
  }

  private async updateModuleEntity(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    await this.updateModuleComponentPipeline(moduleEntity, componentDeploymentEntity, circles)
    return this.modulesRepository.save(moduleEntity)
  }

  private async processComponentPipeline(
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ) {

    const { moduleDeployment: moduleDeploymentEntity } = componentDeploymentEntity
    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ moduleId: moduleDeploymentEntity.moduleId })

    return moduleEntity ?
      this.updateModuleEntity(moduleEntity, componentDeploymentEntity, circles) :
      this.createModuleEntity(moduleDeploymentEntity, componentDeploymentEntity, circles)
  }

  public async processPipeline(componentDeploymentId: string): Promise<void> {
    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    const { circles } = componentDeployment.moduleDeployment.deployment
    await this.processComponentPipeline(componentDeployment, circles)
  }
}
