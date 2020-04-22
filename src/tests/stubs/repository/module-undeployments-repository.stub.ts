import { ModuleUndeploymentEntity } from '../../../app/api/deployments/entity'

export class ModuleUndeploymentsRepositoryStub {
    public async updateStatus(): Promise<void> {
        return Promise.resolve()
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }

    public async findOne(): Promise<ModuleUndeploymentEntity> {
        return Promise.resolve({} as ModuleUndeploymentEntity)
    }
}
