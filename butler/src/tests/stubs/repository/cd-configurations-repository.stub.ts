/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    CdConfigurationEntity
} from '../../../app/api/configurations/entity'
import { ICdConfigurationData } from '../../../app/api/configurations/interfaces'
import {DeleteResult} from 'typeorm'

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

    public delete(cdConfigurationId: string): Promise<DeleteResult> {
        return Promise.resolve({} as DeleteResult)
    }

}
