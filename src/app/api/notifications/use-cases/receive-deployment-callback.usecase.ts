import { Injectable } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import { ComponentDeploymentEntity, DeploymentEntity } from '../../deployments/entity'
import { NotificationStatusEnum } from '../enums'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { MooveService } from '../../../core/integrations/moove'
import { PipelineQueuesService } from '../../deployments/services'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../../deployments/repository'
import { Repository } from 'typeorm'
import {StatusManagementService} from '../../../core/services/deployments'

@Injectable()
export class ReceiveDeploymentCallbackUsecase {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly mooveService: MooveService,
    private readonly deploymentsStatusManagementService: StatusManagementService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  public async execute(
    componentDeploymentId: string,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    try {
      this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)
      finishDeploymentDto.isSuccessful() ?
        await this.handleDeploymentSuccess(componentDeploymentId) :
        await this.handleDeploymentFailure(componentDeploymentId)
      this.consoleLoggerService.log('FINISH:FINISH_DEPLOYMENT_NOTIFICATION')
    } catch (error) {
      return Promise.reject({})
    }
  }

  private async notifyMooveIfDeploymentJustFailed(
    componentDeploymentId: string
  ): Promise<void> {

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const { moduleDeployment: { deployment } } = componentDeployment

    if (!deployment.hasFailed()) {
      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId
      )
    }
  }

  private async handleDeploymentFailure(
    componentDeploymentId: string
  ): Promise<void> {

    this.consoleLoggerService.log('START:DEPLOYMENT_FAILURE_WEBHOOK', { componentDeploymentId })
    await this.pipelineQueuesService.setQueuedDeploymentStatusFinished(componentDeploymentId)
    await this.pipelineQueuesService.triggerNextComponentPipeline(componentDeploymentId)
    await this.notifyMooveIfDeploymentJustFailed(componentDeploymentId)
    await this.deploymentsStatusManagementService.setComponentDeploymentStatusAsFailed(componentDeploymentId)
    this.consoleLoggerService.log('START:DEPLOYMENT_FAILURE_WEBHOOK', { componentDeploymentId })
  }

  private async notifyMooveIfDeploymentFinished(
    componentDeploymentId: string
  ): Promise<void> {

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const { moduleDeployment: { deployment } } = componentDeployment

    if (deployment.hasFinished()) {
      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.SUCCEEDED, deployment.callbackUrl, deployment.circleId
      )
    }
  }

  private async handleDeploymentSuccess(
    componentDeploymentId: string
  ): Promise<void> {

    this.consoleLoggerService.log('START:DEPLOYMENT_SUCCESS_WEBHOOK', { componentDeploymentId })
    await this.pipelineQueuesService.setQueuedDeploymentStatusFinished(componentDeploymentId)
    await this.pipelineQueuesService.triggerNextComponentPipeline(componentDeploymentId)
    await this.deploymentsStatusManagementService.setComponentDeploymentStatusAsFinished(componentDeploymentId)
    await this.notifyMooveIfDeploymentFinished(componentDeploymentId)
    this.consoleLoggerService.log('FINISH:DEPLOYMENT_SUCCESS_WEBHOOK', { componentDeploymentId })
  }
}
