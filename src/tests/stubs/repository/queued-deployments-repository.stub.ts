import { QueuedDeploymentEntity } from '../../../app/api/deployments/entity'

export class QueuedDeploymentsRepositoryStub {

    public async findOne(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public async save(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public getAllByComponentIdQueuedAscending(): Promise<QueuedDeploymentEntity[]> {
        return Promise.resolve([] as QueuedDeploymentEntity[])
    }
    public getAllByComponentIdAscending(id: string): Promise<QueuedDeploymentEntity[]> {
        return Promise.resolve([] as QueuedDeploymentEntity[])
    }
    public update(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public getOneByComponentIdRunning(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }
}
