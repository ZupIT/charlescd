/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import { LogEntity } from '../entity/logs.entity'
import { Log } from '../interfaces/log.interface'

@EntityRepository(LogEntity)
export class LogRepository extends Repository<LogEntity> {

  public async findDeploymentLogs(deploymentId: string): Promise<LogEntity | undefined> {
    const logEntries = await this.query(`
      SELECT l.deployment_id, json_agg((select * from jsonb_array_elements(l.logs))) as logs 
      FROM v2logs l 
      WHERE l.deployment_id = $1
      GROUP BY deployment_id`, [deploymentId])

    return this.toLogEntity(deploymentId, logEntries)
  }

  private toLogEntity(deploymentId: string, logEntries: LogEntity[]) {
    return new LogEntity(deploymentId, this.extractLogs(logEntries))
  }

  private extractLogs(logEntries: LogEntity[]): Log[] {
    return logEntries ?
      logEntries
        .flatMap(e => e.logs)
        .sort(this.byTimestamp)
      : []
  }

  private byTimestamp(a: Log, b: Log): number {
    const d1 = new Date(a.timestamp)
    const d2 = new Date(b.timestamp)

    if (d1 > d2) {
      return 1
    }
    if (d1 < d2) {
      return -1
    }
    return 0
  }

  public async saveDeploymentsLogs(currentDeploymentsIds: string[], log: Log): Promise<void[]> {
    return this.manager.transaction( manager => {
      return Promise.all(currentDeploymentsIds.map(
        async deploymentId => {
          const logEntity = new LogEntity(deploymentId, [log])
          await manager.save(LogEntity, logEntity)
        }
      ))
    })
  }
}
