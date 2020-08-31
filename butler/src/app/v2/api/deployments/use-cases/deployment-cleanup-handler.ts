import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JobWithDoneCallback } from 'pg-boss'
import { In } from 'typeorm'
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc'
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { MooveService } from '../../../../v1/core/integrations/moove'
import { ExecutionRepository, UpdatedExecution } from '../repository/execution.repository'

export class DeploymentCleanupHandler {
  constructor(
    @InjectRepository(ExecutionRepository)
    private executionRepository: ExecutionRepository,
    private mooveService: MooveService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private envConfiguration: IEnvConfiguration,
  ) { }

  public async run(job: JobWithDoneCallback<unknown, unknown>): Promise<UpdatedExecution[] | undefined>{
    const updatedExecutionIds = await this.executionRepository.updateTimedOutStatus(this.envConfiguration.deploymentExpireTime)
    if (updatedExecutionIds !== undefined && updatedExecutionIds.length > 0) {
      const updatedExecutions = await this.executionRepository.find({ where: { id: In(updatedExecutionIds.map(e => e.id)) }, relations: ['deployment'] })
      for (const row of updatedExecutions) {
        const result = await this.notifyMoove(row.deploymentId, row.status, row.deployment.callbackUrl, row.incomingCircleId)
        await this.executionRepository.updateNotificationStatus(row.id, result.status)
      }
    }
    job.done()
    return updatedExecutionIds
  }

  private async notifyMoove(deploymentId: string, status: string, callbackUrl: string, circleId: string | null) {
    return await this.mooveService.notifyDeploymentStatusV2(
      deploymentId,
      status,
      callbackUrl,
      circleId
    )
  }
}
