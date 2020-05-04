import { ReadCdConfigurationDto } from '../../../app/api/configurations/dto'

export class CreateCdConfigurationUsecaseStub {

    public execute(): Promise<ReadCdConfigurationDto> {
        return Promise.resolve({} as ReadCdConfigurationDto)
    }
}
