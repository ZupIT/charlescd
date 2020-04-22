import {
  EntityRepository,
  Repository
} from 'typeorm'
import { ModuleUndeploymentEntity } from '../entity'
import { UndeploymentStatusEnum } from '../enums';

@EntityRepository(ModuleUndeploymentEntity)
export class ModuleUndeploymentsRepository extends Repository<ModuleUndeploymentEntity> {

  public async updateStatus(
    moduleUneploymentId: string,
    status: UndeploymentStatusEnum
  ): Promise<void> {
    await this.update(moduleUneploymentId, { status, finishedAt: new Date() })
  }
}
