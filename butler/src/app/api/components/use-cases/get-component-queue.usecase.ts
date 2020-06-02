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

import { Injectable } from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../../deployments/repository'
import { InjectRepository } from '@nestjs/typeorm'
import { QueuedDeploymentEntity } from '../../deployments/entity'

@Injectable()
export class GetComponentQueueUseCase {
    constructor(
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentRepository: ComponentDeploymentsRepository
    ) {
    }

    public async execute(componentDeploymentId: string): Promise<ReadQueuedDeploymentDto[]> {
        const queuedDeployments: QueuedDeploymentEntity[]  = await this.queuedDeploymentsRepository
            .getAllByComponentIdAscending(componentDeploymentId)
        return queuedDeployments.map(
            queuedDeployment => queuedDeployment.toReadDto()
        )
    }
}
