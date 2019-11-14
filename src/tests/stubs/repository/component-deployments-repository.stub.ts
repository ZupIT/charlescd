import { ComponentDeploymentEntity } from '../../../app/api/deployments/entity'

export class ComponentDeploymentsRepositoryStub {

    public async getOneWithRelations(): Promise<ComponentDeploymentEntity> {
        return Promise.resolve({} as ComponentDeploymentEntity)
    }
}
