import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Execution } from '../../api/deployments/entity/execution.entity'
import { DeploymentStatusEnum } from '../../api/deployments/enums/deployment-status.enum'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository/component.repository'
import { ExecutionRepository } from '../../api/deployments/repository/execution.repository'
import { K8sClient } from '../../core/integrations/k8s/client'
import { MooveService } from '../../core/integrations/moove/moove.service'
import { ConsoleLoggerService } from '../../core/logs/console'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'

@Injectable()
export class TimeoutScheduler {
  constructor(
    private readonly mooveService: MooveService,
    private readonly componentRepository: ComponentsRepositoryV2,
    private readonly k8sClient: K8sClient,
    private readonly executionRepository: ExecutionRepository,
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly logger: ConsoleLoggerService
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handleCron(): Promise<void> {
    const timedOutExecutions = await this.executionRepository.updateTimedOutExecutions()
    await Promise.all(
      timedOutExecutions.map(async execution => this.handleExecutionTimeOut(execution))
    )
    const activeComponents = await this.componentRepository.findActiveComponents()
    await this.k8sClient.applyRoutingCustomResource(activeComponents)
  }

  private async handleExecutionTimeOut(execution: Execution): Promise<void> {
    this.logger.log('TIMEOUT_NOTIFICATION', { executionId: execution.id, deploymentId: execution.deploymentId })
    await this.notifyCallback(execution)

    // TODO use transaction
    await this.deploymentRepository.update({ id: execution.deploymentId }, { current: false })
    const deployment = await this.deploymentRepository.findOneOrFail({ id: execution.deploymentId })
    if (deployment.previousDeploymentId) {
      await this.deploymentRepository.update({ id: deployment.previousDeploymentId }, { current: true })
      const previousDeployment = await this.deploymentRepository.findOneOrFail({ id: deployment.previousDeploymentId })
      await this.k8sClient.applyDeploymentCustomResource(previousDeployment)
    } else {
      await this.k8sClient.applyUndeploymentCustomResource(deployment)
    }
  }

  private async notifyCallback(execution : Execution) {
    const notificationResponse = await this.mooveService.notifyDeploymentStatusV2(
      execution.deploymentId,
      DeploymentStatusEnum.TIMED_OUT,
      execution.deployment.callbackUrl,
      execution.deployment.circleId
    )
    return await this.executionRepository.updateNotificationStatus(execution.id, notificationResponse.status)
  }
}
