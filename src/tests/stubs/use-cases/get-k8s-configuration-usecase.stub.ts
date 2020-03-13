import { ReadK8sConfigurationDto } from '../../../app/api/configurations/dto'

export class GetK8sConfigurationUsecaseStub {

    public execute(): Promise<ReadK8sConfigurationDto[]> {
        return Promise.resolve([] as ReadK8sConfigurationDto[])
    }
}
