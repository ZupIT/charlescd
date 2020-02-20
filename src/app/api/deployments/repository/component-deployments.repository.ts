import {
  EntityRepository,
  Repository
} from 'typeorm'
import { ComponentDeploymentEntity } from '../entity'

@EntityRepository(ComponentDeploymentEntity)
export class ComponentDeploymentsRepository extends Repository<ComponentDeploymentEntity> {

  public async getOneWithRelations(
    componentDeploymentId: string
  ): Promise<ComponentDeploymentEntity> {
    return this.findOne({
      where: { id: componentDeploymentId },
      relations: ['moduleDeployment', 'moduleDeployment.deployment']
    })
  }
  public async getOneWithStatusFinished(
      idComponent: string
  ): Promise<ComponentDeploymentEntity> {
    return this.findOne({
      where: { componentId: idComponent, status: 'FINISHED'},
      relations: ['moduleDeployment', 'moduleDeployment.deployment']
    })
  }
}
