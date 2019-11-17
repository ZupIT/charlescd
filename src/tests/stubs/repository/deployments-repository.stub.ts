import { DeploymentEntity } from '../../../app/api/deployments/entity'

export class DeploymentsRepositoryStub {

    public async findOne(): Promise<DeploymentEntity> {
        return Promise.resolve({} as DeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }
}
