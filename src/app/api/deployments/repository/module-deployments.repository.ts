import {
  EntityRepository,
  Repository
} from 'typeorm'
import { ModuleDeploymentEntity} from '../entity'
import { DeploymentStatusEnum } from '../enums';

@EntityRepository(ModuleDeploymentEntity)
export class ModuleDeploymentsRepository extends Repository<ModuleDeploymentEntity> {

  public async updateStatus(
    moduleDeploymentId: string,
    status: DeploymentStatusEnum
  ): Promise<void> {
    await this.update(moduleDeploymentId, { status, finishedAt: new Date() })
  }
}
