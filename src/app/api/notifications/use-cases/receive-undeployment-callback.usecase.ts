import { Injectable, NotFoundException } from '@nestjs/common'
import { FinishUndeploymentDto } from '../dto'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity, QueuedDeploymentEntity,
  QueuedUndeploymentEntity
} from '../../deployments/entity'
import { NotificationStatusEnum } from '../enums'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { MooveService } from '../../../core/integrations/moove'
import {
  PipelineErrorHandlerService,
  PipelineQueuesService
} from '../../deployments/services'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository
} from '../../deployments/repository'
import { Repository } from 'typeorm'
import { StatusManagementService } from '../../../core/services/deployments'

@Injectable()
export class ReceiveUndeploymentCallbackUsecase {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly mooveService: MooveService,
    private readonly deploymentsStatusManagementService: StatusManagementService,
    private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(QueuedUndeploymentEntity)
    private readonly queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>,
    @InjectRepository(ComponentUndeploymentsRepository)
    private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) { }

  public async execute(
    queuedUndeploymentId: number,
    finishUndeploymentDto: FinishUndeploymentDto
  ): Promise<void> {

    try {
      this.consoleLoggerService.log('START:FINISH_UNDEPLOYMENT_NOTIFICATION', finishUndeploymentDto)
      const queuedUndeploymentEntity: QueuedDeploymentEntity | undefined =
        await this.queuedUndeploymentsRepository.findOne({ id: queuedUndeploymentId })
      if (!queuedUndeploymentEntity) {
        throw new NotFoundException(`QueuedDeploymentEntity with id ${queuedUndeploymentId} not found`)
      }
      if (queuedUndeploymentEntity.isRunning()) {
        finishUndeploymentDto.isSuccessful() ?
          await this.handleSuccessfulUndeployment(queuedUndeploymentId) :
          await this.handleDeploymentFailure(queuedUndeploymentId)
        this.consoleLoggerService.log('FINISH:FINISH_UNDEPLOYMENT_NOTIFICATION')
      }
    } catch (error) {
      return Promise.reject({ error })
    }
  }

  private async handleDeploymentFailure(
    queuedUndeploymentId: number
  ): Promise<void> {

    this.consoleLoggerService.log('START:UNDEPLOYMENT_FAILURE_WEBHOOK', { queuedUndeploymentId })
    const queuedUndeployment: QueuedUndeploymentEntity | undefined =
      await this.queuedUndeploymentsRepository.findOne({ id: queuedUndeploymentId })

    if (!queuedUndeployment) {
      throw new NotFoundException(`QueuedUndeploymentEntity with id ${queuedUndeploymentId} not found`)
    }

    const componentDeployment: ComponentDeploymentEntity | undefined =
      await this.componentDeploymentsRepository.findOne({ id: queuedUndeployment.componentDeploymentId })
    if (!componentDeployment) {
      throw new NotFoundException(`ComponentDeploymentEntity with id ${queuedUndeployment.componentDeploymentId} not found`)
    }
    const componentUndeployment: ComponentUndeploymentEntity =
      await this.componentUndeploymentsRepository.getOneWithRelations(queuedUndeployment.componentUndeploymentId)

    await this.pipelineErrorHandlerService.handleComponentUndeploymentFailure(componentDeployment, queuedUndeployment)
    await this.pipelineErrorHandlerService.handleUndeploymentFailure(componentUndeployment.moduleUndeployment.undeployment)

    this.consoleLoggerService.log('START:UNDEPLOYMENT_FAILURE_WEBHOOK', { queuedUndeploymentId })
  }

  private async notifyMooveIfUndeploymentFinished(
    componentUndeploymentId: string
  ): Promise<void> {

    const componentUndeployment: ComponentUndeploymentEntity =
      await this.componentUndeploymentsRepository.getOneWithRelations(componentUndeploymentId)
    const { moduleUndeployment: { undeployment } } = componentUndeployment
    const { deployment } = undeployment

    if (undeployment.hasFinished()) {
      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.UNDEPLOYED, deployment.callbackUrl, deployment.circleId
      )
    }
  }

  private async handleSuccessfulUndeployment(
    queuedUndeploymentId: number
  ): Promise<void> {

    this.consoleLoggerService.log('START:UNDEPLOYMENT_SUCCESS_WEBHOOK', { queuedUndeploymentId })
    const queuedUndeployment: QueuedUndeploymentEntity | undefined =
      await this.queuedUndeploymentsRepository.findOne({ id: queuedUndeploymentId })

    if (!queuedUndeployment) {
      throw new NotFoundException(`Undeployment with id ${queuedUndeploymentId} not found`)
    }

    const componentDeployment: ComponentDeploymentEntity | undefined =
      await this.componentDeploymentsRepository.findOne({ id: queuedUndeployment.componentDeploymentId })

    if (!componentDeployment) {
      throw new NotFoundException(`ComponentDeploymentEntity with id ${queuedUndeployment.componentDeploymentId} not found`)
    }

    await this.pipelineQueuesService.setQueuedUndeploymentStatusFinished(queuedUndeploymentId)
    this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
    await this.deploymentsStatusManagementService.setComponentUndeploymentStatusAsFinished(queuedUndeployment.componentUndeploymentId)
    await this.notifyMooveIfUndeploymentFinished(queuedUndeployment.componentUndeploymentId)

    this.consoleLoggerService.log('FINISH:UNDEPLOYMENT_SUCCESS_WEBHOOK', { queuedUndeploymentId })
  }
}
