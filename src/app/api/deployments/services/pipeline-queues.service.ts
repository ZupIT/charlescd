import {
  Inject,
  Injectable
} from '@nestjs/common'
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
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { NotificationStatusEnum } from '../../notifications/enums'
import { StatusManagementService } from '../../../core/services/deployments'
import { MooveService } from '../../../core/integrations/moove'
import { ComponentEntity } from '../../components/entity'
import { PipelineDeploymentsService } from './'
import { AppConstants } from '../../../core/constants'
import { IConsulKV } from '../../../core/integrations/consul/interfaces'

@Injectable()
export class PipelineQueuesService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(QueuedUndeploymentEntity)
    private readonly queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(ComponentUndeploymentsRepository)
    private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly consulConfiguration: IConsulKV,
    private readonly statusManagementService: StatusManagementService,
    private readonly mooveService: MooveService,
    private readonly pipelineDeploymentsService: PipelineDeploymentsService
  ) {}

  public async triggerNextComponentPipeline(finishedComponentDeployment: ComponentDeploymentEntity): Promise<void> {
    try {
      const nextQueuedDeployment: QueuedDeploymentEntity =
          await this.queuedDeploymentsRepository.getNextQueuedDeployment(finishedComponentDeployment.componentId)

      if (nextQueuedDeployment) {
        nextQueuedDeployment.type === QueuedPipelineTypesEnum.QueuedDeploymentEntity ?
            await this.triggerQueuedDeployment(nextQueuedDeployment) :
            await this.triggerQueuedUndeployment(nextQueuedDeployment as QueuedUndeploymentEntity)
      }
    } catch (error) {
      throw error
    }
  }

  private async triggerQueuedDeployment(queuedDeployment: QueuedDeploymentEntity): Promise<void> {

    let componentDeployment: ComponentDeploymentEntity
    let component: ComponentEntity

    try {
      componentDeployment = await this.componentDeploymentsRepository.getOneWithRelations(queuedDeployment.componentDeploymentId)
      component = await this.componentsRepository.findOne({ id: componentDeployment.componentId })
      await this.triggerDeploymentPipeline(componentDeployment, component, queuedDeployment)
    } catch (error) {
      await this.handleDeploymentFailure(queuedDeployment, componentDeployment)
      await this.triggerNextComponentPipeline(componentDeployment)
      throw error
    }
  }

  private async triggerQueuedUndeployment(queuedUndeployment: QueuedUndeploymentEntity): Promise<void> {

    let componentDeployment: ComponentDeploymentEntity
    let component: ComponentEntity

    try {
      componentDeployment = await this.componentDeploymentsRepository.getOneWithRelations(queuedUndeployment.componentDeploymentId)
      component = await this.componentsRepository.findOne({ id: componentDeployment.componentId })
      await this.triggerUndeploymentPipeline(componentDeployment, component, queuedUndeployment)
    } catch (error) {
      await this.handleUndeploymentFailure(queuedUndeployment)
      await this.triggerNextComponentPipeline(componentDeployment)
      throw error
    }
  }

  private async triggerDeploymentPipeline(
      componentDeployment: ComponentDeploymentEntity,
      component: ComponentEntity,
      queuedDeployment: QueuedDeploymentEntity
  ): Promise<void> {

    const { moduleDeployment: { deployment } } = componentDeployment
    await this.updateComponentDeploymentPipeline(componentDeployment, component)
    const pipelineCallbackUrl: string = this.getDeploymentCallbackUrl(queuedDeployment.id)
    await this.pipelineDeploymentsService.triggerComponentDeployment(
        component, deployment, componentDeployment,
        pipelineCallbackUrl, queuedDeployment.id
    )
  }

  private async updateComponentDeploymentPipeline(
      componentDeployment: ComponentDeploymentEntity,
      component: ComponentEntity
  ): Promise<void> {

    try {
      const { moduleDeployment: { deployment } } = componentDeployment
      deployment.defaultCircle ?
          component.setPipelineDefaultCircle(componentDeployment) :
          component.setPipelineCircle(deployment.circle, componentDeployment)
      await this.componentsRepository.save(component)
    } catch (error) {
      throw error
    }
  }

  private getDeploymentCallbackUrl(queuedDeploymentId: number): string {
    return `${this.consulConfiguration.darwinDeploymentCallbackUrl}?queuedDeploymentId=${queuedDeploymentId}`
  }

  private async triggerUndeploymentPipeline(
      componentDeployment: ComponentDeploymentEntity,
      component: ComponentEntity,
      queuedDeployment: QueuedDeploymentEntity
  ): Promise<void> {

    const { moduleDeployment: { deployment } } = componentDeployment
    await this.updateComponentUndeploymentPipeline(componentDeployment, component)
    const pipelineCallbackUrl: string = this.getUndeploymentCallbackUrl(queuedDeployment.id)
    await this.pipelineDeploymentsService.triggerComponentDeployment(
        component, deployment, componentDeployment,
        pipelineCallbackUrl, queuedDeployment.id
    )
  }

  private async updateComponentUndeploymentPipeline(
      componentDeployment: ComponentDeploymentEntity,
      component: ComponentEntity
  ): Promise<void> {

    try {
      const { moduleDeployment: { deployment } } = componentDeployment
      component.unsetPipelineCircle(deployment.circle)
      await this.componentsRepository.save(component)
    } catch (error) {
      throw error
    }
  }

  private getUndeploymentCallbackUrl(queuedUndeploymentId: number): string {
    return `${this.consulConfiguration.darwinUndeploymentCallbackUrl}?queuedUndeploymentId=${queuedUndeploymentId}`
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

  private async handleUndeploymentFailure(queuedUndeployment: QueuedUndeploymentEntity): Promise<void> {
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

  private async handleDeploymentFailure(queuedDeployment: QueuedDeploymentEntity, componentDeployment: ComponentDeploymentEntity): Promise<void> {
    const deployment: DeploymentEntity = componentDeployment.moduleDeployment.deployment
    await this.setQueuedDeploymentStatusFinished(queuedDeployment.id)
    if (deployment && !deployment.hasFailed()) {
      await this.statusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
      await this.mooveService.notifyDeploymentStatus(deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId)
    }
  }
}
