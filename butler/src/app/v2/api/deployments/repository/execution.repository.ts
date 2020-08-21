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

import { EntityRepository, Repository, UpdateResult } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { Execution } from '../entity/execution.entity'

export type ReturningUpdate = { id: string, status: DeploymentStatusEnum, callback_url: string, circle_id: string }

@EntityRepository(Execution)
export class ExecutionRepository extends Repository<Execution> {

  public async updateNotificationStatus(id: string, status: number) : Promise<UpdateResult>{
    if (status >= 200 && status < 300) {
      return await this.update({ id: id }, { notificationStatus: 'SENT' })
    } else {
      return await this.update({ id: id }, { notificationStatus: 'ERROR' })
    }
  }
}
