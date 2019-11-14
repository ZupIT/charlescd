import { QueuedUndeploymentEntity } from '../../../app/api/deployments/entity'

export class QueuedUndeploymentsRepositoryStub {

    public async findOne(): Promise<QueuedUndeploymentEntity> {
        return Promise.resolve({} as QueuedUndeploymentEntity)
    }
}
