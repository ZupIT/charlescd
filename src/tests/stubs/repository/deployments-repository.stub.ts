import { DeploymentEntity } from '../../../app/api/deployments/entity'

export class DeploymentsRepositoryStub {

    public async findOne(): Promise<DeploymentEntity> {
        return {} as DeploymentEntity
    }
}
