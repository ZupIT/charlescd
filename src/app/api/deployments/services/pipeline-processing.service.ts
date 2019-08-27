import { Injectable } from '@nestjs/common'
import { ModuleEntity } from '../../modules/entity'
import { ComponentEntity } from '../../components/entity'
import { CircleDeploymentEntity, ComponentDeploymentEntity, ModuleDeploymentEntity } from '../entity'
import { IPipelineOptions } from '../../components/interfaces'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'

@Injectable()
export class PipelineProcessingService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
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
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions =
      this.spinnakerService.createNewPipelineOptions(circles, componentDeployment)

    return moduleEntity.addComponent(new ComponentEntity(
      componentDeployment.componentId,
      pipelineOptions
    ))
  }

  private getCreateModuleComponentDeployment(
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
  ): Promise<ModuleEntity> {

    return this.modulesRepository.save(
      new ModuleEntity(
        moduleDeploymentEntity.moduleId,
        this.getCreateModuleComponentDeployment(componentDeploymentEntity, circles)
      )
    )
  }

  private async updateComponentPipelineObject(
    componentEntity: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ): Promise<void> {

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
  ): Promise<ModuleEntity> {

    await this.updateModuleComponentPipeline(moduleEntity, componentDeploymentEntity, circles)
    return this.modulesRepository.save(moduleEntity)
  }

  private async processComponentPipeline(
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[]
  ): Promise<ModuleEntity> {

    const { moduleDeployment: moduleDeploymentEntity } = componentDeploymentEntity
    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ moduleId: moduleDeploymentEntity.moduleId })

    return moduleEntity ?
      this.updateModuleEntity(moduleEntity, componentDeploymentEntity, circles) :
      this.createModuleEntity(moduleDeploymentEntity, componentDeploymentEntity, circles)
  }

  public async processPipeline(componentDeploymentId: string): Promise<void> {
    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })
    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    const { circles } = componentDeployment.moduleDeployment.deployment
    await this.processComponentPipeline(componentDeployment, circles)
    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })
  }
}
