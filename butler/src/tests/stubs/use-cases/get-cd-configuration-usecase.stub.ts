import { ReadCdConfigurationDto } from '../../../app/api/configurations/dto'

export class GetCdConfigurationUsecaseStub {

    public execute(): Promise<ReadCdConfigurationDto[]> {
        return Promise.resolve([] as ReadCdConfigurationDto[])
    }
}
