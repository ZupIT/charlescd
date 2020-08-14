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
import { DeploymentEntityV2 } from '../entity/deployment.entity'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'

@EntityRepository(DeploymentEntityV2)
export class DeploymentRepositoryV2 extends Repository<DeploymentEntityV2> {

  public async findActiveComponents(): Promise<DeploymentEntityV2[]> {
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .where('deployment.active = true')
      .getMany()
  }

  public async updateTimedOutStatus(timeInMinutes: number) : Promise<UpdateResult>{
    return await this.createQueryBuilder('v2deployments')
      .where(`v2deployments.created_at < now() - interval '${timeInMinutes} minutes'`)
      .andWhere('v2deployments.notification_status = \'NOT_SENT\'')
      .update(DeploymentEntityV2)
      .set({ status: DeploymentStatusEnum.TIMED_OUT }).returning(['id', 'deploymentId', 'status', 'callbackUrl', 'circleId']).execute()
  }

  public async updateDeployment(id: string, status: number) : Promise<UpdateResult>{
    if (status >= 200 && status < 300) {
      return await this.update(id, { notificationStatus: 'SENT' })
    } else {
      return await this.update(id, { notificationStatus: 'ERROR' })
    }
  }
}
