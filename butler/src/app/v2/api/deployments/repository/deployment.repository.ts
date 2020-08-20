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
import { DeploymentEntityV2 } from '../entity/deployment.entity'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'

export type ReturningUpdate = { id: string, status: DeploymentStatusEnum, callback_url: string, circle_id: string }

@EntityRepository(DeploymentEntityV2)
export class DeploymentRepositoryV2 extends Repository<DeploymentEntityV2> {

  public async findActiveComponents(): Promise<DeploymentEntityV2[]> {
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .where('deployment.active = true')
      .getMany()
  }

  public async updateTimedOutStatus(timeInMinutes: number): Promise<ReturningUpdate[] | undefined>{
    const result = await getConnection().manager.query(`
      WITH timed_out_deployments AS
        (UPDATE v2deployments
        SET status = '${DeploymentStatusEnum.TIMED_OUT}'
        WHERE v2deployments.created_at < now() - interval '${timeInMinutes} minutes'
        AND v2deployments.notification_status = 'NOT_SENT'
        RETURNING *)
      UPDATE v2components c
      SET running = FALSE
      FROM timed_out_deployments
      WHERE c.deployment_id = timed_out_deployments.id RETURNING *
    `)
    if (Array.isArray(result)) {
      return result[0]
    }
    return
  }

  public async updateDeployment(id: string, status: number) : Promise<UpdateResult>{
    if (status >= 200 && status < 300) {
      return await this.update(id, { notificationStatus: 'SENT' })
    } else {
      return await this.update(id, { notificationStatus: 'ERROR' })
    }
  }
}
