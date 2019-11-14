import { QueuedDeploymentEntity } from '../../../app/api/deployments/entity'

export class QueuedDeploymentsRepositoryStub {

    public async findOne(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }
}
