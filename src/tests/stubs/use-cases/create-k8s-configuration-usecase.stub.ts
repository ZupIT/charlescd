import { ReadK8sConfigurationDto } from '../../../app/api/configurations/dto'

export class CreateK8sConfigurationUsecaseStub {

    public execute(): Promise<ReadK8sConfigurationDto> {
        return Promise.resolve({} as ReadK8sConfigurationDto)
    }
}
