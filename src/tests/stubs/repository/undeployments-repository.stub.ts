import { UndeploymentEntity } from '../../../app/api/deployments/entity'

export class UndeploymentsRepositoryStub {

    public async findOne(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async updateStatus(): Promise<void> {
        return Promise.resolve()
    }

    public async findOneOrFail(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async save(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }
}
