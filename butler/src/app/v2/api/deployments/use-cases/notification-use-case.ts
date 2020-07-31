import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Repository } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'

export class NotificationUseCase {
  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentRepository: Repository<DeploymentEntity>,

  ) { }

  public async handleCallback(deploymentId: string, status: DeploymentStatusEnum): Promise<DeploymentEntity>{
    const deployment = await this.deploymentRepository.findOneOrFail(deploymentId, { relations: ['components'] })
    deployment.finishedAt = new Date()
    deployment.components = deployment.components.map(c => {
      c.running = false
      return c
    })

    if (status === DeploymentStatusEnum.SUCCEEDED) {
      deployment.status = DeploymentStatusEnum.SUCCEEDED
      deployment.active = true
    }

    if (status === DeploymentStatusEnum.FAILED) {
      deployment.status = DeploymentStatusEnum.FAILED
      deployment.active = false
    }
    return await this.deploymentRepository.save(deployment)
  }

}

