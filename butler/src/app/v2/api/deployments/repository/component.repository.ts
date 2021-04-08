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
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { ComponentEntityV2 } from '../entity/component.entity'

@EntityRepository(ComponentEntityV2)
export class ComponentsRepositoryV2 extends Repository<ComponentEntityV2> {

  public async findActiveComponents(): Promise<ComponentEntityV2[]> {
    // WARNING: ALWAYS RETURN COMPONENT WITH ITS DEPLOYMENT
    // TODO: we may have to save the workspace_id now in case the user is using the same butler for multiple workspaces
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .leftJoin('deployment.executions', 'e', 'e.deployment_id = deployment.id')
      .where('deployment.current = true')
      .andWhere('e.status != :status', { status: DeploymentStatusEnum.TIMED_OUT })
      .orderBy('deployment.created_at', 'DESC')
      .getMany()
  }

  public async findHealthyActiveComponents(): Promise<ComponentEntityV2[]> {
    // WARNING: ALWAYS RETURN COMPONENT WITH ITS DEPLOYMENT
    // TODO: we may have to save the workspace_id now in case the user is using the same butler for multiple workspaces
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .where('deployment.current = true')
      .andWhere('deployment.healthy = true')
      .orderBy('deployment.created_at', 'DESC')
      .getMany()
  }

  public async findDefaultActiveComponents(defaultCircleId: string): Promise<ComponentEntityV2[]> {
    // WARNING: ALWAYS RETURN COMPONENT WITH ITS DEPLOYMENT
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .where('deployment.current = true')
      .andWhere('deployment.default_circle is true')
      .andWhere('deployment.circle_id = :defaultCircleId', { defaultCircleId })
      .orderBy('deployment.created_at', 'DESC')
      .getMany()
  }

  public async findCircleCreatedExecution(circleId: string): Promise<ComponentEntityV2[]> {
    return this.createQueryBuilder('c')
      .leftJoin('v2deployments', 'd', 'c.deployment_id = d.id')
      .leftJoin('v2executions', 'e', 'e.deployment_id = d.id')
      .where('d.circle_id = :circleId', { circleId })
      .andWhere('e.status = :status', { status: DeploymentStatusEnum.CREATED })
      .orderBy('d.created_at', 'DESC')
      .getMany()
  }

  public async findActiveComponentsByCircleId(circleId: string): Promise<ComponentEntityV2[]> {
    // WARNING: ALWAYS RETURN COMPONENT WITH ITS DEPLOYMENT
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .where('deployment.current = true')
      .andWhere('deployment.circle_id = :circleId', { circleId })
      .orderBy('deployment.created_at', 'DESC')
      .getMany()
  }
}
