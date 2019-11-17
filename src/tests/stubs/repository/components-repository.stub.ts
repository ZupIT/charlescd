import { ComponentEntity } from '../../../app/api/components/entity'

export class ComponentsRepositoryStub {

    public async findOne(): Promise<ComponentEntity> {
        return Promise.resolve({} as ComponentEntity)
    }

    public async save(): Promise<ComponentEntity> {
        return {} as ComponentEntity
    }
}
