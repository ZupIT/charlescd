import { EntityRepository, Repository } from 'typeorm'
import { ComponentUndeploymentEntity } from '../entity'

@EntityRepository(ComponentUndeploymentEntity)
export class ComponentUndeploymentsRepository extends Repository<ComponentUndeploymentEntity> {

    public async getOneWithRelations(
        componentUndeploymentId: string
    ): Promise<ComponentUndeploymentEntity> {

        return this.findOne({
            where: { id: componentUndeploymentId },
            relations: ['moduleUndeployment', 'moduleUndeployment.undeployment']
        })
    }
}
