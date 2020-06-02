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

import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { QueuedDeploymentEntity, QueuedUndeploymentEntity } from '../../../app/api/deployments/entity'

export class PipelineQueuesServiceStub {

    public async getQueuedPipelineStatus(): Promise<QueuedPipelineStatusEnum> {
        return Promise.resolve({} as QueuedPipelineStatusEnum)
    }

    public async enqueueUndeploymentExecution(): Promise<QueuedUndeploymentEntity> {
        return Promise.resolve({} as QueuedUndeploymentEntity)
    }

    public async setQueuedUndeploymentStatusFinished(): Promise<void> {
        return Promise.resolve()
    }

    public async setQueuedDeploymentStatusFinished(): Promise<void> {
        return Promise.resolve()
    }

    public async triggerNextComponentPipeline(): Promise<void> {
        return Promise.resolve()
    }

    public async queueDeploymentTasks(): Promise<void> {
        return Promise.resolve()
    }
    public async getComponentDeploymentQueue(): Promise<QueuedDeploymentEntity[]> {
        return Promise.resolve([] as QueuedDeploymentEntity[])
    }

}
