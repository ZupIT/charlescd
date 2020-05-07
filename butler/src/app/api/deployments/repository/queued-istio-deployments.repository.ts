import {
  EntityRepository,
  Repository
} from 'typeorm'
import { QueuedIstioDeploymentEntity } from '../entity'
// import { QueuedPipelineStatusEnum } from '../enums'

@EntityRepository(QueuedIstioDeploymentEntity)
export class QueuedIstioDeploymentsRepository extends Repository<QueuedIstioDeploymentEntity> {

  // public async getNextQueuedDeployment(componentId: string): Promise<QueuedDeploymentEntity | undefined> {
  //   return this.createQueryBuilder('queued_deployment')
  //       .where(
  //           'queued_deployment.component_id = :componentId AND queued_deployment.status = :status',
  //           { componentId, status: QueuedPipelineStatusEnum.QUEUED })
  //       .orderBy('queued_deployment.id', 'ASC')
  //       .getOne()
  // }

  // public async getAllByComponentIdQueuedAscending(componentId: string): Promise<QueuedDeploymentEntity[]> {
  //   return this.createQueryBuilder('queued_deployment')
  //     .where(
  //       'queued_deployment.component_id = :componentId AND queued_deployment.status = :status',
  //       { componentId, status: QueuedPipelineStatusEnum.QUEUED })
  //     .orderBy('queued_deployment.id', 'ASC')
  //     .getMany()
  // }

  // public async getAllByComponentIdAscending(componentId: string): Promise<QueuedDeploymentEntity[]> {
  //   return this.createQueryBuilder('queued_deployment')
  //     .where('queued_deployment.component_id = :componentId', { componentId })
  //     .orderBy('queued_deployment.id', 'ASC')
  //     .getMany()
  // }

  // public async getOneByComponentIdRunning(componentId: string): Promise<QueuedDeploymentEntity | undefined> {
  //   return this.createQueryBuilder('queued_deployment')
  //     .where(
  //       'queued_deployment.component_id = :componentId AND queued_deployment.status = :status',
  //       { componentId, status: QueuedPipelineStatusEnum.RUNNING })
  //     .orderBy('queued_deployment.id', 'ASC')
  //     .getOne()
  // }
}
