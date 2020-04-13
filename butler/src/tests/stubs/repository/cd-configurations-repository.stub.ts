import {
    CdConfigurationEntity
} from '../../../app/api/configurations/entity'
import { ICdConfigurationData } from '../../../app/api/configurations/interfaces'

export class CdConfigurationsRepositoryStub {

    public findDecrypted(): Promise<ICdConfigurationData> {
        return Promise.resolve({} as ICdConfigurationData)
    }

    public save(): Promise<CdConfigurationEntity> {
        return Promise.resolve({} as CdConfigurationEntity)
    }

    public saveEncrypted(): Promise<CdConfigurationEntity> {
        return Promise.resolve({} as CdConfigurationEntity)
    }
}
