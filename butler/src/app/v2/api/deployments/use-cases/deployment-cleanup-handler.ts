import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JobWithDoneCallback } from 'pg-boss'
import { UpdateResult } from 'typeorm'
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc'
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { MooveService } from '../../../../v1/core/integrations/moove'
import { DeploymentRepositoryV2 } from '../repository/deployment.repository'

interface UpdateResultReturning {
  id: string,
  external_id: string,
  status: string,
  callback_url: string,
  circle_id: string | null
}

export class DeploymentCleanupHandler {
  constructor(
    @InjectRepository(DeploymentRepositoryV2)
    private deploymentsRepository: DeploymentRepositoryV2,
    private mooveService: MooveService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private envConfiguration: IEnvConfiguration,
  ) { }

  public async run(job: JobWithDoneCallback<unknown, unknown>): Promise<UpdateResult>{
    const updatedDeployments =  await this.deploymentsRepository.updateTimedOutStatus(this.envConfiguration.deploymentExpireTime)
    if (updatedDeployments.affected) {
      for await (const row of updatedDeployments.raw) {
        const result = await this.notifyMoove(row.external_id, row.status, row.callback_url, row.circle_id)
        await this.deploymentsRepository.updateDeployment(row.id, result.status)
      }
    }
    job.done()
    return updatedDeployments
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
