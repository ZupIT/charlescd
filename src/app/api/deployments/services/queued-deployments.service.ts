import { Injectable } from '@nestjs/common'
import { QueuedDeploymentStatusEnum } from '../enums'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity
} from '../entity'
import { QueuedDeploymentsRepository } from '../repository'
import { PipelineProcessingService } from './pipeline-processing.service'
import { PipelineDeploymentService } from './pipeline-deployment.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ModuleEntity } from '../../modules/entity'

@Injectable()
export class QueuedDeploymentsService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelineProcessingService: PipelineProcessingService,
    private readonly pipelineDeploymentService: PipelineDeploymentService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>
  ) {}

  public async setQueuedDeploymentStatusFinished(componentDeploymentId: string): Promise<void> {
    await this.queuedDeploymentsRepository.update(
      { componentDeploymentId }, { status: QueuedDeploymentStatusEnum.FINISHED }
    )
  }

  private async getQueuedDeploymentStatus(componentId: string): Promise<QueuedDeploymentStatusEnum> {
    const runningDeployment: QueuedDeploymentEntity =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(componentId)

    return runningDeployment ?
      QueuedDeploymentStatusEnum.QUEUED :
      QueuedDeploymentStatusEnum.RUNNING
  }

  private async saveQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    await this.queuedDeploymentsRepository.save(
      new QueuedDeploymentEntity(componentId, componentDeploymentId, status)
    )
  }

  private async createDefaultQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    this.consoleLoggerService.log(`START:CREATE_QUEUED_DEPLOYMENT`, { componentId, componentDeploymentId, status })
    await this.saveQueuedDeployment(componentId, componentDeploymentId, status)
    this.consoleLoggerService.log(`FINISH:CREATE_QUEUED_DEPLOYMENT`)
  }

  private async prepareComponentDeployment(componentDeploymentId: string): Promise<void> {
    await this.pipelineProcessingService.processPipeline(componentDeploymentId)
    await this.pipelineDeploymentService.processDeployment(componentDeploymentId)
  }

  private async createRunningQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    this.consoleLoggerService.log(`START:CREATE_RUNNING_DEPLOYMENT`, { componentId, componentDeploymentId, status })
    await this.prepareComponentDeployment(componentDeploymentId)
    await this.saveQueuedDeployment(componentId, componentDeploymentId, status)
    this.consoleLoggerService.log(`FINISH:CREATE_RUNNING_DEPLOYMENT`)
  }

  private async updateQueuedDeploymentStatus(
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    await this.queuedDeploymentsRepository.update(
      { componentDeploymentId },
    { status }
    )
  }

  private async updateRunningQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    this.consoleLoggerService.log(`START:RUN_QUEUED_DEPLOYMENT`, { componentId, componentDeploymentId, status })
    await this.prepareComponentDeployment(componentDeploymentId)
    await this.updateQueuedDeploymentStatus(componentDeploymentId, status)
    this.consoleLoggerService.log(`FINISH:RUN_QUEUED_DEPLOYMENT`)
  }

  private async createQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    status === QueuedDeploymentStatusEnum.RUNNING ?
      this.createRunningQueuedDeployment(componentId, componentDeploymentId, status) :
      this.createDefaultQueuedDeployment(componentId, componentDeploymentId, status)
  }

  private async queueComponentDeploymentTask(componentDeployment: ComponentDeploymentEntity): Promise<void> {
    const { id: componentDeploymentId, componentId } = componentDeployment
    const status: QueuedDeploymentStatusEnum = await this.getQueuedDeploymentStatus(componentId)
    await this.createQueuedDeployment(componentId, componentDeploymentId, status)
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
      await this.modulesRepository.findOne({ moduleId: moduleDeploymentEntity.moduleId })

    if (!moduleEntity) {
      await this.createNewModuleEntity(moduleDeploymentEntity)
    }
  }

  private async queueModuleDeploymentTasks(moduleDeployment: ModuleDeploymentEntity): Promise<void[]> {
    await this.createModuleIfInexistent(moduleDeployment)
    return Promise.all(
      moduleDeployment.components.map(
        componentDeployment => this.queueComponentDeploymentTask(componentDeployment)
      )
    )
  }

  public async queueDeploymentTasks(deployment: DeploymentEntity): Promise<void> {
    this.consoleLoggerService.log(`START:QUEUE_DEPLOYMENTS`)
    await Promise.all(
      deployment.modules.map(
        moduleDeployment => this.queueModuleDeploymentTasks(moduleDeployment)
      )
    )
    this.consoleLoggerService.log(`FINISH:QUEUE_DEPLOYMENTS`)
  }

  private async deployNextComponent(orderedQueuedDeployments: QueuedDeploymentEntity[]): Promise<void> {
    if (orderedQueuedDeployments.length) {
      const componentDeployment: ComponentDeploymentEntity = await this.componentDeploymentRepository.findOne(
        { id: orderedQueuedDeployments[0].componentDeploymentId }
      )
      await this.updateRunningQueuedDeployment(
        componentDeployment.componentId, componentDeployment.id, QueuedDeploymentStatusEnum.RUNNING
      )
    }
  }

  public async triggerNextComponentDeploy(
    finishedComponentDeploymentId: string
  ): Promise<void> {

    const finishedComponentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({ id : finishedComponentDeploymentId })
    const { componentId: finishedComponentId } = finishedComponentDeployment
    const queuedDeployments: QueuedDeploymentEntity[] =
      await this.queuedDeploymentsRepository.getAllByComponentIdQueuedAscending(finishedComponentId)
    await this.deployNextComponent(queuedDeployments)
  }

  public async getComponentDeploymentQueue(
    componentId: string
  ): Promise<QueuedDeploymentEntity[]> {

    return this.queuedDeploymentsRepository.getAllByComponentIdAscending(componentId)
  }
}
