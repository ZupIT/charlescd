import {
  EntityRepository,
  Repository
} from 'typeorm'
import { ComponentDeploymentEntity } from '../entity'
import { DeploymentStatusEnum } from '../enums';

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

  public async updateStatus(
      componentDeploymentId: string,
      status: DeploymentStatusEnum
  ): Promise<void> {
    await this.update(componentDeploymentId, { status, finishedAt: new Date() })
  }
}
