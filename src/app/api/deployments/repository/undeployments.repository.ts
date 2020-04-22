import { EntityRepository, Repository } from 'typeorm'
import { UndeploymentEntity } from '../entity'
import { UndeploymentStatusEnum } from '../enums';

@EntityRepository(UndeploymentEntity)
export class UndeploymentsRepository extends Repository<UndeploymentEntity> {

    public async updateStatus(
        undeploymentId: string,
        status: UndeploymentStatusEnum
    ): Promise<void> {
          await this.update(undeploymentId, { status, finishedAt: new Date() })
    }
}
