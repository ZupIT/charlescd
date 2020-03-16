import {
    CdConfigurationDataEntity,
    CdConfigurationEntity
} from '../../../app/api/configurations/entity'

export class K8sConfigurationsRepositoryStub {

    public findDecrypted(): Promise<CdConfigurationDataEntity> {
        return Promise.resolve({} as CdConfigurationDataEntity)
    }

    public save(): Promise<CdConfigurationEntity> {
        return Promise.resolve({} as CdConfigurationEntity)
    }

    public saveEncrypted(): Promise<CdConfigurationEntity> {
        return Promise.resolve({} as CdConfigurationEntity)
    }
}
