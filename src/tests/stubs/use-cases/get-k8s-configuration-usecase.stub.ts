import { ReadCdConfigurationDto } from '../../../app/api/configurations/dto'

export class GetK8sConfigurationUsecaseStub {

    public execute(): Promise<ReadCdConfigurationDto[]> {
        return Promise.resolve([] as ReadCdConfigurationDto[])
    }
}
