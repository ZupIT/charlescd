import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Execution } from '../../api/deployments/entity/execution.entity'
import { DeploymentStatusEnum } from '../../api/deployments/enums/deployment-status.enum'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository/component.repository'
import { ExecutionRepository } from '../../api/deployments/repository/execution.repository'
import { K8sClient } from '../../core/integrations/k8s/client'
import { MooveService } from '../../core/integrations/moove/moove.service'
import { ConsoleLoggerService } from '../../core/logs/console'

@Injectable()
export class TimeoutScheduler {
  constructor(
    private readonly mooveService: MooveService,
    private readonly componentRepository: ComponentsRepositoryV2,
    private readonly k8sClient: K8sClient,
    private readonly executionRepository: ExecutionRepository,
    private readonly logger: ConsoleLoggerService
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async handleCron(): Promise<void> {
    const timedOutExecutions = await this.executionRepository.updateTimedOutExecutions()

    await Promise.all(timedOutExecutions.map(async e => {
      this.logger.log('TIMEOUT_NOTIFICATION', { executionId: e.id, deploymentId: e.deploymentId })
      await this.notifyCallback(e)
    }))

    const activeComponents = await this.componentRepository.findActiveComponents()
    await this.k8sClient.applyRoutingCustomResource(activeComponents)
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
