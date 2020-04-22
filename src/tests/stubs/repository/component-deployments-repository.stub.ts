import { ComponentDeploymentEntity } from '../../../app/api/deployments/entity'

export class ComponentDeploymentsRepositoryStub {

    public async getOneWithRelations(): Promise<ComponentDeploymentEntity> {
        return Promise.resolve({} as ComponentDeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }

    public async updateStatus(): Promise<void> {
        return Promise.resolve()
    }

    public async findOne(): Promise<ComponentDeploymentEntity> {
        return Promise.resolve({} as ComponentDeploymentEntity)
    }
}
