import { K8sConfigurationDataEntity } from '../../../app/api/configurations/entity'

export class K8sConfigurationsRepositoryStub {

    public findDecrypted(): Promise<K8sConfigurationDataEntity> {
        return Promise.resolve({} as K8sConfigurationDataEntity)
    }
}
