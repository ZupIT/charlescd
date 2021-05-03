import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Execution } from '../../api/deployments/entity/execution.entity'
import { DeploymentStatusEnum } from '../../api/deployments/enums/deployment-status.enum'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { ExecutionRepository } from '../../api/deployments/repository/execution.repository'
import { K8sClient } from '../../core/integrations/k8s/client'
import { MooveService } from '../../core/integrations/moove'
import { ConsoleLoggerService } from '../../core/logs/console'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { EntityManager, getConnection } from 'typeorm'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'

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

    await Promise.all(timedOutExecutions.map(execution => this.handleExecutionTimeOut(execution)))
    if (timedOutExecutions?.length) {
      await this.updateCharlesRoutes()
    }
  }

  private async handleExecutionTimeOut(execution: Execution): Promise<void> {
    this.logger.log('STEP:NOTIFY_TIMEOUT', { executionId: execution.id, deploymentId: execution.deploymentId })
    await this.notifyCallback(execution)

    await getConnection().transaction(async transactionManager => {
      this.logger.log('STEP:ROLLBACK_TIMED_OUT_DEPLOYMENT')
      await this.rollbackDeployment(execution, transactionManager)
    })
  }

  private async rollbackDeployment(execution: Execution, transactionManager: EntityManager): Promise<void> {
    await transactionManager.update(DeploymentEntityV2, { id: execution.deploymentId }, { current: false })
    const deployment = await transactionManager.findOneOrFail(DeploymentEntityV2, { id: execution.deploymentId })
    if (deployment.previousDeploymentId) {
      await transactionManager.update(DeploymentEntityV2, { id: deployment.previousDeploymentId }, { current: true })
      const previousDeployment = await transactionManager.findOneOrFail(DeploymentEntityV2, { id: deployment.previousDeploymentId })
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

  private async updateCharlesRoutes(): Promise<void> {
    const activeComponents = await this.componentRepository.findActiveComponents()
    await this.k8sClient.applyRoutingCustomResource(activeComponents)
  }
}
