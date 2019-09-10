import { Injectable } from '@nestjs/common'
import { ModuleEntity } from '../../modules/entity'
import { ComponentEntity } from '../../components/entity'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../entity'
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
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions =
      this.spinnakerService.createNewPipelineOptions(circles, componentDeployment, defaultCircle)

    return moduleEntity.addComponent(new ComponentEntity(
      componentDeployment.componentId,
      pipelineOptions
    ))
  }

  private async updateComponentPipelineObject(
    componentEntity: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions = this.spinnakerService.updatePipelineOptions(
      componentEntity.pipelineOptions, circles, componentDeployment, defaultCircle
    )
    return componentEntity.updatePipelineOptions(pipelineOptions)
  }

  private async updateModuleComponentPipeline(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      moduleEntity.getComponentById(componentDeploymentEntity.componentId)

    componentEntity ?
      await this.updateComponentPipelineObject(componentEntity, componentDeploymentEntity, circles, defaultCircle) :
      await this.createModuleComponent(moduleEntity, componentDeploymentEntity, circles, defaultCircle)
  }

  private async updateModuleEntity(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ): Promise<ModuleEntity> {

    await this.updateModuleComponentPipeline(moduleEntity, componentDeploymentEntity, circles, defaultCircle)
    return this.modulesRepository.save(moduleEntity)
  }

  private async processComponentPipeline(
    componentDeploymentEntity: ComponentDeploymentEntity,
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ): Promise<ModuleEntity> {

    const { moduleDeployment: moduleDeploymentEntity } = componentDeploymentEntity
    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ moduleId: moduleDeploymentEntity.moduleId })
    return this.updateModuleEntity(moduleEntity, componentDeploymentEntity, circles, defaultCircle)
  }

  public async processPipeline(
    componentDeploymentId: string,
    defaultCircle: boolean
  ): Promise<void> {

    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })
    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    const { circles } = componentDeployment.moduleDeployment.deployment
    await this.processComponentPipeline(componentDeployment, circles, defaultCircle)
    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })
  }
}
