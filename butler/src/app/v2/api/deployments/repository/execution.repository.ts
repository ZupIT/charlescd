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

import { EntityRepository, Repository, UpdateResult, getConnection } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { Execution } from '../entity/execution.entity'
import { NotificationStatusEnum } from '../../../core/enums/notification-status.enum'

export type UpdatedExecution = { id: string }

@EntityRepository(Execution)
export class ExecutionRepository extends Repository<Execution> {

  public async updateNotificationStatus(id: string, status: number) : Promise<UpdateResult>{
    if (status >= 200 && status < 300) {
      return await this.update({ id: id }, { notificationStatus: NotificationStatusEnum.SENT })
    } else {
      return await this.update({ id: id }, { notificationStatus: NotificationStatusEnum.ERROR })
    }
  }

  public async updateTimedOutStatus(timeInMinutes: number): Promise<UpdatedExecution[] | undefined>{ // TODO move to executions repo
    const result = await getConnection().manager.query(`
      WITH timed_out_executions AS
        (UPDATE v2executions
        SET status = '${DeploymentStatusEnum.TIMED_OUT}'
        WHERE v2executions.created_at < now() - interval '${timeInMinutes} minutes'
        AND v2executions.notification_status = 'NOT_SENT'
        RETURNING *)
      UPDATE v2components c
      SET running = FALSE
      FROM timed_out_executions
      WHERE c.deployment_id = timed_out_executions.deployment_id RETURNING timed_out_executions.id
    `)
    if (Array.isArray(result)) {
      return result[0]
    }
    return
  }
}
