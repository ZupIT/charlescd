import { UndeploymentEntity } from '../../../app/api/deployments/entity'

export class UndeploymentsRepositoryStub {

    public async save(): Promise<UndeploymentEntity> {
        return {} as UndeploymentEntity
    }
}
