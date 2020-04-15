import {
  EntityRepository,
  Repository
} from 'typeorm'
import { ComponentDeploymentEntity } from '../entity'

@EntityRepository(ComponentDeploymentEntity)
export class ComponentDeploymentsRepository extends Repository<ComponentDeploymentEntity> {

  public async getOneWithRelations(
    componentDeploymentId: string
  ): Promise<ComponentDeploymentEntity | undefined> {
    return this.findOne({
      where: { id: componentDeploymentId },
      relations: ['moduleDeployment', 'moduleDeployment.deployment']
    })
  }
}
