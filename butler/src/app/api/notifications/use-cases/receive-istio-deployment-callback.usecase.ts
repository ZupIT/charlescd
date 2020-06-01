import { Injectable } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import {
  ComponentDeploymentEntity,
  QueuedIstioDeploymentEntity
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
  QueuedIstioDeploymentsRepository
} from '../../deployments/repository'
import { StatusManagementService } from '../../../core/services/deployments'

@Injectable()
export class ReceiveIstioDeploymentCallbackUsecase {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
    private readonly mooveService: MooveService,
    private readonly statusManagementService: StatusManagementService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(QueuedIstioDeploymentsRepository)
    private readonly queuedIstioDeploymentsRepository: QueuedIstioDeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
  ) { }

  public async execute(
    queuedIstioDeploymentId: number,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {
    this.consoleLoggerService.log('START:FINISH_ISTIO_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)
    const queuedIstioDeploymentEntity: QueuedIstioDeploymentEntity =
      await this.queuedIstioDeploymentsRepository.findOneOrFail({ id: queuedIstioDeploymentId })

    try {
      if (queuedIstioDeploymentEntity.isRunning()) {
        finishDeploymentDto.isSuccessful() ?
          await this.handleIstioDeploymentSuccess(queuedIstioDeploymentId) :
          await this.handleIstioDeploymentFailure(queuedIstioDeploymentId)
        this.consoleLoggerService.log('FINISH:FINISH_ISTIO_DEPLOYMENT_NOTIFICATION')
      }
    } catch (error) {
      this.consoleLoggerService.error('ERROR:FINISH_ISTIO_DEPLOYMENT_NOTIFICATION', error)
      throw error
    }
  }

  private async handleIstioDeploymentFailure(
    queuedIstioDeploymentId: number
  ): Promise<void> {

    this.consoleLoggerService.log('START:ISTIO_DEPLOYMENT_FAILURE_WEBHOOK', { queuedIstioDeploymentId })
    const queuedIstioDeployment: QueuedIstioDeploymentEntity =
      await this.queuedIstioDeploymentsRepository.findOneOrFail({ id: queuedIstioDeploymentId })

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(queuedIstioDeployment.componentDeploymentId)

    const { moduleDeployment: { deployment } } = componentDeployment

    await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
    this.consoleLoggerService.log('FINISH:ISTIO_DEPLOYMENT_FAILURE_WEBHOOK', { queuedIstioDeploymentId })
  }

  private async notifyMooveIfDeploymentFinished(
    componentDeploymentId: string
  ): Promise<void> {

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)

    const { moduleDeployment: { deployment } } = componentDeployment

    if (deployment.hasSucceeded()) {
      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.SUCCEEDED, deployment.callbackUrl, deployment.circleId
      )
    }
  }

  private async handleIstioDeploymentSuccess(
    queuedIstioDeploymentId: number
  ): Promise<void> {
    this.consoleLoggerService.log('START:ISTIO_DEPLOYMENT_SUCCESS_WEBHOOK', { queuedIstioDeploymentId })
    const queuedIstioDeployment: QueuedIstioDeploymentEntity =
      await this.queuedIstioDeploymentsRepository.findOneOrFail({ id: queuedIstioDeploymentId })

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.findOneOrFail({ id: queuedIstioDeployment.componentDeploymentId })

    await this.pipelineQueuesService.setQueuedIstioDeploymentStatusFinished(queuedIstioDeploymentId)

    this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
    await this.statusManagementService.setComponentDeploymentStatusAsFinished(componentDeployment.id)
    await this.notifyMooveIfDeploymentFinished(componentDeployment.id)
    this.consoleLoggerService.log('FINISH:ISTIO_DEPLOYMENT_SUCCESS_WEBHOOK', { queuedIstioDeploymentId })
  }
}
