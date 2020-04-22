import { ComponentUndeploymentEntity } from '../../../app/api/deployments/entity'

export class ComponentUndeploymentsRepositoryStub {

    public async getOneWithRelations(): Promise<ComponentUndeploymentEntity> {
        return Promise.resolve({} as ComponentUndeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }

    public async updateStatus(): Promise<void> {
        return Promise.resolve()
    }
}
