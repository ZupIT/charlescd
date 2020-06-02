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
  EntityRepository,
  Repository
} from 'typeorm'
import { QueuedDeploymentEntity } from '../entity'
import { QueuedPipelineStatusEnum } from '../enums'

@EntityRepository(QueuedDeploymentEntity)
export class QueuedDeploymentsRepository extends Repository<QueuedDeploymentEntity> {

  public async getNextQueuedDeployment(componentId: string): Promise<QueuedDeploymentEntity | undefined> {
    return this.createQueryBuilder('queued_deployment')
        .where(
            'queued_deployment.component_id = :componentId AND queued_deployment.status = :status',
            { componentId, status: QueuedPipelineStatusEnum.QUEUED })
        .orderBy('queued_deployment.id', 'ASC')
        .getOne()
  }

  public async getAllByComponentIdQueuedAscending(componentId: string): Promise<QueuedDeploymentEntity[]> {
    return this.createQueryBuilder('queued_deployment')
      .where(
        'queued_deployment.component_id = :componentId AND queued_deployment.status = :status',
        { componentId, status: QueuedPipelineStatusEnum.QUEUED })
      .orderBy('queued_deployment.id', 'ASC')
      .getMany()
  }

  public async getAllByComponentIdAscending(componentId: string): Promise<QueuedDeploymentEntity[]> {
    return this.createQueryBuilder('queued_deployment')
      .where('queued_deployment.component_id = :componentId', { componentId })
      .orderBy('queued_deployment.id', 'ASC')
      .getMany()
  }

  public async getOneByComponentIdRunning(componentId: string): Promise<QueuedDeploymentEntity | undefined> {
    return this.createQueryBuilder('queued_deployment')
      .where(
        'queued_deployment.component_id = :componentId AND queued_deployment.status = :status',
        { componentId, status: QueuedPipelineStatusEnum.RUNNING })
      .orderBy('queued_deployment.id', 'ASC')
      .getOne()
  }
}
