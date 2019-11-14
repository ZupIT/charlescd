import { UndeploymentEntity } from '../../../app/api/deployments/entity'

export class UndeploymentsRepositoryStub {

    public async findOne(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async save(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }
}
