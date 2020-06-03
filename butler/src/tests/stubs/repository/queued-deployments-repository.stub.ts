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

import { QueuedDeploymentEntity } from '../../../app/api/deployments/entity'

export class QueuedDeploymentsRepositoryStub {

    public async findOne(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public async findOneOrFail(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public async save(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public getAllByComponentIdQueuedAscending(): Promise<QueuedDeploymentEntity[]> {
        return Promise.resolve([] as QueuedDeploymentEntity[])
    }
    public getAllByComponentIdAscending(id: string): Promise<QueuedDeploymentEntity[]> {
        return Promise.resolve([] as QueuedDeploymentEntity[])
    }

    public update(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public getOneByComponentIdRunning(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }

    public getNextQueuedDeployment(): Promise<QueuedDeploymentEntity> {
        return Promise.resolve({} as QueuedDeploymentEntity)
    }
}
