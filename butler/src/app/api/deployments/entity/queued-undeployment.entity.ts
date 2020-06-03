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
    ChildEntity,
    Column
} from 'typeorm'
import {
    QueuedPipelineStatusEnum,
    QueuedPipelineTypesEnum
} from '../enums'
import { ReadQueuedDeploymentDto } from '../dto'
import { QueuedDeploymentEntity } from './queued-deployment.entity'

@ChildEntity()
export class QueuedUndeploymentEntity extends QueuedDeploymentEntity {

    @Column({ name: 'component_undeployment_id' })
    public componentUndeploymentId: string

    constructor(
        componentId: string,
        componentDeploymentId: string,
        status: QueuedPipelineStatusEnum,
        componentUndeploymentId: string
    ) {
        super(componentId, componentDeploymentId, status)
        this.componentUndeploymentId = componentUndeploymentId
        this.type = QueuedPipelineTypesEnum.QueuedUndeploymentEntity
    }

    public toReadDto(): ReadQueuedDeploymentDto {
        return new ReadQueuedDeploymentDto(
            this.id,
            this.componentId,
            this.componentDeploymentId,
            this.status,
            this.createdAt
        )
    }
}
