import { Injectable } from '@nestjs/common'
import { QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../enums'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity
} from '../entity'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../repository'
import { PipelinesService } from './pipelines.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ModuleEntity } from '../../modules/entity'

@Injectable()
export class PipelineQueuesService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelinesService: PipelinesService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>
  ) {}

  public async queueDeploymentTasks(deployment: DeploymentEntity): Promise<void> {
    this.consoleLoggerService.log(`START:QUEUE_DEPLOYMENTS`)
    await Promise.all(
      deployment.modules.map(
        moduleDeployment => this.queueModuleDeploymentTasks(moduleDeployment, deployment.defaultCircle)
      )
    )
    this.consoleLoggerService.log(`FINISH:QUEUE_DEPLOYMENTS`)
  }

  public async triggerNextComponentDeploy(
    finishedComponentDeploymentId: string
  ): Promise<void> {

    const finishedComponentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.findOne({ id : finishedComponentDeploymentId })
    const { componentId: finishedComponentId } = finishedComponentDeployment

    const orderedDeployments: QueuedDeploymentEntity[] =
      await this.queuedDeploymentsRepository.getAllByComponentIdQueuedAscending(finishedComponentId)
    await this.deployNextComponent(orderedDeployments)
  }

  public async getComponentDeploymentQueue(
    componentId: string
  ): Promise<QueuedDeploymentEntity[]> {

    return this.queuedDeploymentsRepository.getAllByComponentIdAscending(componentId)
  }

  public async setQueuedDeploymentStatusFinished(componentDeploymentId: string): Promise<void> {
    await this.queuedDeploymentsRepository.update(
      { componentDeploymentId }, { status: QueuedPipelineStatusEnum.FINISHED }
    )
  }

  public async getQueuedPipelineStatus(componentId: string): Promise<QueuedPipelineStatusEnum> {
    const runningDeployment: QueuedDeploymentEntity =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(componentId)

    return runningDeployment ?
      QueuedPipelineStatusEnum.QUEUED :
      QueuedPipelineStatusEnum.RUNNING
  }

  public async enqueuePipelineExecution(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    type: QueuedPipelineTypesEnum
  ): Promise<void> {

    await this.queuedDeploymentsRepository.save(
      new QueuedDeploymentEntity(componentId, componentDeploymentId, status, type)
    )
  }

  private async createDefaultQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ): Promise<void> {

    this.consoleLoggerService.log(`START:CREATE_QUEUED_DEPLOYMENT`, { componentId, componentDeploymentId, status })
    await this.enqueuePipelineExecution(componentId, componentDeploymentId, status, QueuedPipelineTypesEnum.DEPLOYMENT)
    this.consoleLoggerService.log(`FINISH:CREATE_QUEUED_DEPLOYMENT`)
  }

  private async prepareComponentDeployment(
    componentDeploymentId: string,
    defaultCircle: boolean
  ): Promise<void> {

    await this.pipelinesService.triggerDeployment(componentDeploymentId, defaultCircle)
  }

  private async createRunningQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    defaultCircle: boolean
  ): Promise<void> {

    this.consoleLoggerService.log(`START:CREATE_RUNNING_DEPLOYMENT`, { componentId, componentDeploymentId, status })
    await this.enqueuePipelineExecution(componentId, componentDeploymentId, status, QueuedPipelineTypesEnum.DEPLOYMENT)
    await this.prepareComponentDeployment(componentDeploymentId, defaultCircle)
    this.consoleLoggerService.log(`FINISH:CREATE_RUNNING_DEPLOYMENT`)
  }

  private async updateQueuedDeploymentStatus(
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ): Promise<void> {

    await this.queuedDeploymentsRepository.update(
      { componentDeploymentId },
    { status }
    )
  }

  private async updateRunningQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    defaultCircle: boolean
  ): Promise<void> {

    this.consoleLoggerService.log(`START:RUN_QUEUED_DEPLOYMENT`, { componentId, componentDeploymentId, status })
    await this.prepareComponentDeployment(componentDeploymentId, defaultCircle)
    await this.updateQueuedDeploymentStatus(componentDeploymentId, status)
    this.consoleLoggerService.log(`FINISH:RUN_QUEUED_DEPLOYMENT`)
  }

  private async createQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    defaultCircle: boolean
  ): Promise<void> {

    status === QueuedPipelineStatusEnum.RUNNING ?
      this.createRunningQueuedDeployment(componentId, componentDeploymentId, status, defaultCircle) :
      this.createDefaultQueuedDeployment(componentId, componentDeploymentId, status)
  }

  private async queueComponentDeploymentTask(
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const { id: componentDeploymentId, componentId } = componentDeployment
    const status: QueuedPipelineStatusEnum = await this.getQueuedPipelineStatus(componentId)
    await this.createQueuedDeployment(componentId, componentDeploymentId, status, defaultCircle)
  }

  private async createNewModuleEntity(moduleDeploymentEntity: ModuleDeploymentEntity): Promise<void> {
    await this.modulesRepository.save(
      new ModuleEntity(
        moduleDeploymentEntity.moduleId,
        []
      )
    )
  }

  private async createModuleIfInexistent(moduleDeploymentEntity: ModuleDeploymentEntity): Promise<void> {
    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ id: moduleDeploymentEntity.moduleId })

    if (!moduleEntity) {
      await this.createNewModuleEntity(moduleDeploymentEntity)
    }
  }

  private async queueModuleDeploymentTasks(
    moduleDeployment: ModuleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void[]> {

    await this.createModuleIfInexistent(moduleDeployment)
    return Promise.all(
      moduleDeployment.components.map(
        componentDeployment => this.queueComponentDeploymentTask(componentDeployment, defaultCircle)
      )
    )
  }

  private async deployNextComponent(orderedDeployments: QueuedDeploymentEntity[]): Promise<void> {

    if (orderedDeployments.length) {

      const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(orderedDeployments[0].componentDeploymentId)

      await this.updateRunningQueuedDeployment(
        componentDeployment.componentId,
        componentDeployment.id,
        QueuedPipelineStatusEnum.RUNNING,
        componentDeployment.moduleDeployment.deployment.defaultCircle
      )
    }
  }
}
