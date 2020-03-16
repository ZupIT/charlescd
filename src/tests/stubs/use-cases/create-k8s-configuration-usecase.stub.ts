import { ReadCdConfigurationDto } from '../../../app/api/configurations/dto'

export class CreateK8sConfigurationUsecaseStub {

    public execute(): Promise<ReadCdConfigurationDto> {
        return Promise.resolve({} as ReadCdConfigurationDto)
    }
}
