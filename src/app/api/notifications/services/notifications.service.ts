import { Injectable } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import { ComponentDeploymentEntity, DeploymentEntity } from '../../deployments/entity'
import { NotificationStatusEnum } from '../enums'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MooveService } from '../../../core/integrations/moove'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'
import { QueuedDeploymentsService } from '../../deployments/services'
import { DeploymentStatusEnum } from '../../deployments/enums'
import { QueuedDeploymentsRepository } from '../../deployments/repository'

@Injectable()
export class NotificationsService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly mooveService: MooveService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly queuedDeploymentsService: QueuedDeploymentsService,
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  private async notifyMooveIfDeploymentJustFailed(
    componentDeploymentId: string
  ): Promise<void> {

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    const { moduleDeployment: { deployment } } = componentDeployment

    if (deployment.status !== DeploymentStatusEnum.FAILED) {
      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl
      )
    }
  }

  private async handleDeploymentFailure(
    componentDeploymentId: string
  ): Promise<void> {

    this.consoleLoggerService.log('START:DEPLOYMENT_FAILURE_WEBHOOK', { componentDeploymentId })
    await this.queuedDeploymentsService.setQueuedDeploymentStatusFinished(componentDeploymentId)
    await this.notifyMooveIfDeploymentJustFailed(componentDeploymentId)
    await this.deploymentsStatusManagementService.setComponentDeploymentStatusAsFailed(componentDeploymentId)
    await this.queuedDeploymentsService.triggerNextComponentDeploy(componentDeploymentId)
    this.consoleLoggerService.log('START:DEPLOYMENT_FAILURE_WEBHOOK', { componentDeploymentId })
  }

  private async notifyMooveIfDeploymentFinished(
    componentDeploymentId: string
  ): Promise<void> {

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({
        where: { id: componentDeploymentId },
        relations: ['moduleDeployment', 'moduleDeployment.deployment']
      })
    const { moduleDeployment: { deployment } } = componentDeployment

    if (deployment.status === DeploymentStatusEnum.FINISHED) {
      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.SUCCEEDED, deployment.callbackUrl
      )
    }
  }

  private async handleDeploymentSuccess(
    componentDeploymentId: string
  ): Promise<void> {

    this.consoleLoggerService.log('START:DEPLOYMENT_SUCCESS_WEBHOOK', { componentDeploymentId })
    await this.queuedDeploymentsService.setQueuedDeploymentStatusFinished(componentDeploymentId)
    await this.deploymentsStatusManagementService.setComponentDeploymentStatusAsFinished(componentDeploymentId)
    await this.notifyMooveIfDeploymentFinished(componentDeploymentId)
    await this.queuedDeploymentsService.triggerNextComponentDeploy(componentDeploymentId)
    this.consoleLoggerService.log('FINISH:DEPLOYMENT_SUCCESS_WEBHOOK', { componentDeploymentId })
  }

  public async finishDeployment(
    componentDeploymentId: string,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)
    finishDeploymentDto.status === NotificationStatusEnum.SUCCEEDED ?
      await this.handleDeploymentSuccess(componentDeploymentId) :
      await this.handleDeploymentFailure(componentDeploymentId)
    this.consoleLoggerService.log('FINISH:FINISH_DEPLOYMENT_NOTIFICATION')
  }
}
