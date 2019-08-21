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

  public async processDeploymentPipelines(deployment: DeploymentEntity) {
    const { circles, modules } = deployment
    return Promise.all(
      modules.map(module => this.processModulePipelines(module, circles))
    )
  }
}
