import { QueuedUndeploymentEntity } from '../../../app/api/deployments/entity'

export class QueuedUndeploymentsRepositoryStub {

    public async findOne(): Promise<QueuedUndeploymentEntity> {
        return Promise.resolve({} as QueuedUndeploymentEntity)
    }

    public async save(): Promise<QueuedUndeploymentEntity> {
        return Promise.resolve({} as QueuedUndeploymentEntity)
    }

    public async update(): Promise<QueuedUndeploymentEntity> {
        return Promise.resolve({} as QueuedUndeploymentEntity)
    }
}
