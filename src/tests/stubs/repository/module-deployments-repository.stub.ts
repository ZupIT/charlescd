import { ModuleDeploymentEntity } from '../../../app/api/deployments/entity'

export class ModuleDeploymentsRepositoryStub {

    public async findOne(): Promise<ModuleDeploymentEntity> {
        return Promise.resolve({} as ModuleDeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }
}
