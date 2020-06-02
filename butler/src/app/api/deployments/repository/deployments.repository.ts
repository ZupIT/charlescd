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

import { EntityRepository, Repository } from 'typeorm'
import { DeploymentEntity, } from '../entity'
import { DeploymentStatusEnum } from '../enums'

@EntityRepository(DeploymentEntity)
export class DeploymentsRepository extends Repository<DeploymentEntity> {

    public async updateStatus(
      deploymentId: string,
      status: DeploymentStatusEnum
    ): Promise<void> {
      await this.update(deploymentId, { status, finishedAt: new Date() })
    }
}
