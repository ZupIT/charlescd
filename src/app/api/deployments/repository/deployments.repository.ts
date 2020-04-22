import { EntityRepository, Repository } from 'typeorm'
import { DeploymentEntity, } from '../entity'
import { DeploymentStatusEnum } from '../enums';


@EntityRepository(DeploymentEntity)
export class DeploymentsRepository extends Repository<DeploymentEntity> {

    public async updateStatus(
        deploymentId: string,
        status: DeploymentStatusEnum
    ): Promise<void> {
        await this.update(deploymentId, { status, finishedAt: new Date() })
    }
}
