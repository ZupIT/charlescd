import { ModuleEntity } from '../../../app/api/modules/entity'

export class ModulesRepositoryStub {

    public async findOne(): Promise<ModuleEntity> {
        return Promise.resolve({} as ModuleEntity)
    }

    public async save(): Promise<ModuleEntity> {
        return Promise.resolve({} as ModuleEntity)
    }
}
