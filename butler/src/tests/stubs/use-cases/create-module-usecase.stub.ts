import { ReadModuleDto } from '../../../app/api/modules/dto'

export class CreateModuleUsecaseStub {

    public execute(): Promise<ReadModuleDto> {
        return Promise.resolve({} as ReadModuleDto)
    }
}
