import { Injectable } from '@nestjs/common'
import {
  DeploymentStatusEnum,
  QueuedPipelineStatusEnum,
  QueuedPipelineTypesEnum,
  UndeploymentStatusEnum
} from '../enums'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity
} from '../entity'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../repository'
import { PipelinesService } from './pipelines.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ModuleEntity } from '../../modules/entity'
import { NotificationStatusEnum } from '../../notifications/enums'
import { StatusManagementService } from '../../../core/services/deployments'
import { MooveService } from '../../../core/integrations/moove'

@Injectable()
export class PipelineQueuesService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelinesService: PipelinesService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(QueuedUndeploymentEntity)
    private readonly queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(ComponentUndeploymentsRepository)
    private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
    private readonly statusManagementService: StatusManagementService,
    private readonly mooveService: MooveService
  ) {}

  public async triggerNextComponentPipeline(finishedComponentDeploymentId: string): Promise<void> {
    let nextQueuedDeployment: QueuedDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity

    try {
      const finishedComponentDeployment: ComponentDeploymentEntity =
          await this.componentDeploymentsRepository.findOne({id: finishedComponentDeploymentId})
      const { componentId: finishedComponentId } = finishedComponentDeployment
      const orderedDeployments: QueuedDeploymentEntity[] =
          await this.queuedDeploymentsRepository.getAllByComponentIdQueuedAscending(finishedComponentId)

      if (orderedDeployments.length) {
        nextQueuedDeployment = orderedDeployments[0]
        componentDeployment = await this.componentDeploymentsRepository.getOneWithRelations(nextQueuedDeployment.componentDeploymentId)
        await this.updateRunningQueuedDeployment(
            componentDeployment.componentId,
            componentDeployment.id,
            nextQueuedDeployment.id
        )
      }
    } catch (error) {
      if (nextQueuedDeployment) {
        if (nextQueuedDeployment.type === QueuedPipelineTypesEnum.QueuedDeploymentEntity) {
          await this.handleNextDeployment(nextQueuedDeployment, componentDeployment)
        } else {
          await this.handleNextUndeployment(nextQueuedDeployment as QueuedUndeploymentEntity)
        }
        await this.triggerNextComponentPipeline(nextQueuedDeployment.componentDeploymentId)
      }
    }
  }

  public async getComponentDeploymentQueue(
    componentId: string
  ): Promise<QueuedDeploymentEntity[]> {

    return this.queuedDeploymentsRepository.getAllByComponentIdAscending(componentId)
  }

  public async setQueuedDeploymentStatusFinished(queuedDeploymentId: number): Promise<void> {
    await this.queuedDeploymentsRepository.update(
      { id: queuedDeploymentId }, { status: QueuedPipelineStatusEnum.FINISHED }
    )
  }

  public async setQueuedUndeploymentStatusFinished(queuedUndeploymentId: number): Promise<void> {
    await this.queuedUndeploymentsRepository.update(
        { id: queuedUndeploymentId }, { status: QueuedPipelineStatusEnum.FINISHED }
    )
  }

  public async getQueuedPipelineStatus(componentId: string): Promise<QueuedPipelineStatusEnum> {
    const runningDeployment: QueuedDeploymentEntity =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(componentId)

    return runningDeployment ?
      QueuedPipelineStatusEnum.QUEUED :
      QueuedPipelineStatusEnum.RUNNING
  }

  public async enqueueDeploymentExecution(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ): Promise<QueuedDeploymentEntity> {

    return await this.queuedDeploymentsRepository.save(
      new QueuedDeploymentEntity(componentId, componentDeploymentId, status)
    )
  }

  public async enqueueUndeploymentExecution(
      componentId: string,
      componentDeploymentId: string,
      status: QueuedPipelineStatusEnum,
      componentUndeploymentId: string
  ): Promise<QueuedUndeploymentEntity> {

    return await this.queuedUndeploymentsRepository.save(
        new QueuedUndeploymentEntity(componentId, componentDeploymentId, status, componentUndeploymentId)
    )
  }

  private async handleNextUndeployment(queuedUndeployment: QueuedUndeploymentEntity): Promise<void> {
      const componentUndeployment: ComponentUndeploymentEntity =
          await this.componentUndeploymentsRepository.getOneWithRelations(queuedUndeployment.componentUndeploymentId)
      const { moduleUndeployment: { undeployment } } = componentUndeployment

      await this.setQueuedUndeploymentStatusFinished(queuedUndeployment.id)
      if (undeployment && !undeployment.hasFailed()) {
        await this.statusManagementService.deepUpdateUndeploymentStatus(undeployment, UndeploymentStatusEnum.FAILED)
        await this.mooveService.notifyDeploymentStatus(
            undeployment.deployment.id, NotificationStatusEnum.UNDEPLOY_FAILED,
            undeployment.deployment.callbackUrl, undeployment.deployment.circleId
        )
      }
  }

  private async handleNextDeployment(queuedDeployment: QueuedDeploymentEntity, componentDeployment: ComponentDeploymentEntity): Promise<void> {
    const deployment: DeploymentEntity = componentDeployment.moduleDeployment.deployment
    await this.setQueuedDeploymentStatusFinished(queuedDeployment.id)
    if (deployment && !deployment.hasFailed()) {
      await this.statusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
      await this.mooveService.notifyDeploymentStatus(deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId)
    }
  }

  private async updateQueuedDeploymentStatus(
    queuedDeploymentId: number,
    status: QueuedPipelineStatusEnum
  ): Promise<void> {

    await this.queuedDeploymentsRepository.update(
      { id: queuedDeploymentId },
    { status }
    )
  }

  private async updateRunningQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    queuedDeploymentId: number
  ): Promise<void> {

    this.consoleLoggerService.log(`START:RUN_QUEUED_DEPLOYMENT`, { componentId, componentDeploymentId })
    await this.triggerNextQueuedPipeline(componentDeploymentId, queuedDeploymentId)
    await this.updateQueuedDeploymentStatus(queuedDeploymentId, QueuedPipelineStatusEnum.RUNNING)
    this.consoleLoggerService.log(`FINISH:RUN_QUEUED_DEPLOYMENT`)
  }

  private async triggerNextQueuedPipeline(
    componentDeploymentId: string,
    queuedDeploymentId: number
  ): Promise<void> {

    const queuedDeployment: QueuedDeploymentEntity =
        await this.queuedDeploymentsRepository.findOne({ id: queuedDeploymentId })

    if (queuedDeployment.type === QueuedPipelineTypesEnum.QueuedDeploymentEntity) {
      await this.pipelinesService.triggerDeployment(componentDeploymentId, queuedDeploymentId)
    } else if (queuedDeployment.type === QueuedPipelineTypesEnum.QueuedUndeploymentEntity) {
      await this.pipelinesService.triggerUndeployment(componentDeploymentId, queuedDeploymentId)
    }
  }
}
