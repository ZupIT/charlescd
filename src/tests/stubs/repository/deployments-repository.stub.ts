import { DeploymentEntity } from '../../../app/api/deployments/entity'

export class DeploymentsRepositoryStub {

    public async findOne(): Promise<DeploymentEntity> {
        return Promise.resolve({} as DeploymentEntity)
    }

    public async findOneOrFail(): Promise<DeploymentEntity> {
        return Promise.resolve({} as DeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }

    public async save(): Promise<DeploymentEntity> {
        return Promise.resolve({} as DeploymentEntity)
    }

    public async find(): Promise<DeploymentEntity> {
        return Promise.resolve({} as DeploymentEntity)
    }
}
