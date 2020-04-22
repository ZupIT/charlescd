import { EntityRepository, Repository } from 'typeorm'
import { ComponentUndeploymentEntity } from '../entity'
import {DeploymentStatusEnum, UndeploymentStatusEnum} from '../enums';

@EntityRepository(ComponentUndeploymentEntity)
export class ComponentUndeploymentsRepository extends Repository<ComponentUndeploymentEntity> {

    public async getOneWithRelations(
        componentUndeploymentId: string
    ): Promise<ComponentUndeploymentEntity> {

        return this.findOne({
            where: { id: componentUndeploymentId },
            relations: [
                'moduleUndeployment',
                'moduleUndeployment.undeployment',
                'moduleUndeployment.undeployment.deployment'
            ]
        })

    }

    public async updateStatus(
        componentUndeploymentId: string,
        status: UndeploymentStatusEnum
    ): Promise<void> {
       await this.update(componentUndeploymentId, { status, finishedAt: new Date() })
    }
}
