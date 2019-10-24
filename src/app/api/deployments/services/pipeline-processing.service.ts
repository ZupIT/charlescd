import { Injectable } from '@nestjs/common'
import { ModuleEntity } from '../../modules/entity'
import { ComponentEntity } from '../../components/entity'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../entity'
import { IPipelineOptions } from '../../components/interfaces'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentDeploymentsRepository } from '../repository'

@Injectable()
export class PipelineProcessingService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository
  ) {}

  private async createModuleComponent(
    moduleEntity: ModuleEntity,
    componentDeployment: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions =
      this.spinnakerService.createNewPipelineOptions(circle, componentDeployment, defaultCircle)

    return moduleEntity.addComponent(new ComponentEntity(
      componentDeployment.componentId,
      pipelineOptions
    ))
  }

  private async updateComponentPipelineObject(
    componentEntity: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions = this.spinnakerService.updatePipelineOptions(
      componentEntity.pipelineOptions, circle, componentDeployment, defaultCircle
    )
    return componentEntity.updatePipelineOptions(pipelineOptions)
  }

  private async updateModuleComponentPipeline(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      moduleEntity.getComponentById(componentDeploymentEntity.componentId)

    componentEntity ?
      await this.updateComponentPipelineObject(componentEntity, componentDeploymentEntity, circle, defaultCircle) :
      await this.createModuleComponent(moduleEntity, componentDeploymentEntity, circle, defaultCircle)
  }

  private async updateModuleEntity(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<ModuleEntity> {

    await this.updateModuleComponentPipeline(moduleEntity, componentDeploymentEntity, circle, defaultCircle)
    return this.modulesRepository.save(moduleEntity)
  }

  private async processComponentPipeline(
    componentDeploymentEntity: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<ModuleEntity> {

    const { moduleDeployment: moduleDeploymentEntity } = componentDeploymentEntity
    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ id: moduleDeploymentEntity.moduleId })
    return this.updateModuleEntity(moduleEntity, componentDeploymentEntity, circle, defaultCircle)
  }

  public async processPipeline(
    componentDeploymentId: string,
    defaultCircle: boolean
  ): Promise<void> {

    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const { circle } = componentDeployment.moduleDeployment.deployment
    await this.processComponentPipeline(componentDeployment, circle, defaultCircle)

    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })
  }
}
