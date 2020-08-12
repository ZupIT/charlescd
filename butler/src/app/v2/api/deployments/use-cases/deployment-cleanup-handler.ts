import { InjectRepository } from '@nestjs/typeorm'
import { JobWithDoneCallback } from 'pg-boss'
import { Repository, UpdateResult } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { MooveService } from '../../../../v1/core/integrations/moove'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'

interface UpdateResultReturning {
  id: string,
  external_id: string,
  status: string,
  callback_url: string,
  circle_id: string | null
}

export class DeploymentCleanupHandler {
  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentsRepository: Repository<DeploymentEntity>,
    private mooveService: MooveService
  ) { }

  public async run(job: JobWithDoneCallback<unknown, unknown>): Promise<UpdateResult>{
    const updatedDeployments =  await this.deploymentsRepository.createQueryBuilder('v2deployments')
      .where('v2deployments.created_at < now() - interval \'15 minutes\'')
      .update(DeploymentEntity)
      .set({ status: DeploymentStatusEnum.TIMED_OUT }).returning(['id', 'deploymentId', 'status', 'callbackUrl', 'circleId']).execute()
    if (updatedDeployments.affected) {
      for await (const row of updatedDeployments.raw) {
        const result = await this.notifyMoove(row.external_id, row.status, row.callback_url, row.circle_id)
        await this.updateDeployment(row.id, result.status)
      }
    }
    job.done()
    return updatedDeployments
  }

  private async updateDeployment(id: string, status: number) {
    if (status >= 200 && status < 300) {
      return await this.deploymentsRepository.update(id, { notificationStatus: 'SENT' })
    } else {
      return await this.deploymentsRepository.update(id, { notificationStatus: 'ERROR' })
    }
  }

  private async notifyMoove(deploymentId: string, status: string, callbackUrl: string, circleId: string | null) {
    return await this.mooveService.notifyDeploymentStatusV2(
      deploymentId,
      status,
      callbackUrl,
      circleId)
  }
}
