import {
  EntityRepository,
  Repository
} from 'typeorm'
import { QueuedIstioDeploymentEntity } from '../entity'

@EntityRepository(QueuedIstioDeploymentEntity)
export class QueuedIstioDeploymentsRepository extends Repository<QueuedIstioDeploymentEntity> {
}
