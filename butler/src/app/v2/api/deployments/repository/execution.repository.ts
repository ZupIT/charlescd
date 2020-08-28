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

import { EntityRepository, getConnection, Repository, UpdateResult } from 'typeorm'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { NotificationStatusEnum } from '../../../core/enums/notification-status.enum'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'

export type UpdatedExecution = { id: string }

@EntityRepository(Execution)
export class ExecutionRepository extends Repository<Execution> {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService
  ) {
    super()
  }

  public async updateNotificationStatus(id: string, status: number) : Promise<UpdateResult>{
    if (status >= 200 && status < 300) {
      return await this.update({ id: id }, { notificationStatus: NotificationStatusEnum.SENT })
    } else {
      return await this.update({ id: id }, { notificationStatus: NotificationStatusEnum.ERROR })
    }
  }

  public async listExecutionsAndRelations(active: boolean, pageSize = 20, page = 1): Promise<Execution[]> {
    const baseQuery = this.createQueryBuilder('e')
      .select('e.id, e.type, e.incoming_circle_id, e.status, e.notification_status, e.created_at, e.finished_at')
      .leftJoin(DeploymentEntity, 'd', 'd.id = e.deployment_id')
      .leftJoin(ComponentEntity, 'c', 'd.id = c.deployment_id')
      .addSelect(`
          json_build_object(
         'id', d.id,
         'author_id', d.author_id,
         'callback_url', d.callback_url,
         'circle_id', d.circle_id,
         'active', d.active,
         'cd_configuration_id', d.cd_configuration_id,
         'created_at', d.created_at,
         'components', json_agg(
           json_build_object(
             'id', c.id,
             'name', c.name,
             'image_url', c.image_url,
             'image_tag', c.image_tag,
             'running', c.running,
             'merged', c.merged)
         )) AS deployment
      `)
      .groupBy('e.id, d.id')
      .andWhere('d.active = :active', { active: active })
      .orderBy({ 'e.created_at': 'DESC', 'e.id': 'DESC' })
      .limit(pageSize)
      .offset(pageSize * (page - 1))

    // TODO leaving this here to discuss keyset pagination
    // if (lastSeenId && lastSeenTimestamp) {
    //   baseQuery = baseQuery.andWhere(
    //     '(date_trunc(\'seconds\', e.created_at), e.id) < (date_trunc(\'seconds\', :createdAt::timestamp), :executionId)',
    //     { createdAt: lastSeenTimestamp, executionId: lastSeenId }
    //   )
    // }
    try {
      const dbResult = await baseQuery.getRawMany()
      if (dbResult.length > 0) {
        const entities = dbResult.map((e) => {
          const execution = new Execution(e.deployment, e.type, e.incomingCircleId, e.status)
          execution.id = e.id
          execution.createdAt = e.created_at
          execution.finishedAt = e.finished_at
          execution.incomingCircleId = e.incoming_circle_id
          execution.notificationStatus = e.notification_status
          execution.status = e.status
          execution.type = e.type
          return execution
        })
        return entities
      }
      return []
    } catch (error) {
      this.consoleLoggerService.log('ERROR:EXECUTIONS_PAGINATION', { error: error })
      return []
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
