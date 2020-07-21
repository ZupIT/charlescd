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

import { UndeploymentEntity } from '../../../app/v1/api/deployments/entity'

export class UndeploymentsRepositoryStub {

    public async findOne(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async updateStatus(): Promise<void> {
        return Promise.resolve()
    }

    public async findOneOrFail(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async save(): Promise<UndeploymentEntity> {
        return Promise.resolve({} as UndeploymentEntity)
    }

    public async update(): Promise<void> {
        return Promise.resolve()
    }
}
