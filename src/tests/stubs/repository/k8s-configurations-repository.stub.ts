import {
    K8sConfigurationDataEntity,
    K8sConfigurationEntity
} from '../../../app/api/configurations/entity'

export class K8sConfigurationsRepositoryStub {

    public findDecrypted(): Promise<K8sConfigurationDataEntity> {
        return Promise.resolve({} as K8sConfigurationDataEntity)
    }

    public save(): Promise<K8sConfigurationEntity> {
        return Promise.resolve({} as K8sConfigurationEntity)
    }

    public saveEncrypted(): Promise<K8sConfigurationEntity> {
        return Promise.resolve({} as K8sConfigurationEntity)
    }
}
