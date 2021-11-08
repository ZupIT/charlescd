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

import { EntityRepository, In, Repository, UpdateResult } from 'typeorm'
import { DeploymentEntityV2 } from '../entity/deployment.entity'

@EntityRepository(DeploymentEntityV2)
export class DeploymentRepositoryV2 extends Repository<DeploymentEntityV2> {

  public async findActiveComponents(): Promise<DeploymentEntityV2[]> {
    return this.createQueryBuilder('v2components')
      .leftJoinAndSelect('v2components.deployment', 'deployment')
      .where('deployment.current = true')
      .getMany()
  }

  public async updateHealthStatus(id: string, status: boolean): Promise<DeploymentEntityV2> {
    const updated = await this.createQueryBuilder('d')
      .update()
      .set({ healthy: status })
      .where({ id: id })
      .returning('id')
      .execute()
    return await this.findOneOrFail(updated.raw[0].id)
  }

  public async updateRouteStatus(circleId: string, status: boolean): Promise<DeploymentEntityV2> {
    const updated = await this.createQueryBuilder('d')
      .update()
      .set({ routed: status })
      .where({ circleId: circleId, current: true })
      .returning('id')
      .execute()
    return await this.findOneOrFail(updated.raw[0].id)
  }

  public async findWithComponentsAndConfig(deploymentId: string): Promise<DeploymentEntityV2> {
    return this.findOneOrFail({ id: deploymentId }, { relations: ['components'] })
  }

  public async updateCurrent(id: string, current: boolean): Promise<UpdateResult> {
    return this.update({ id: id }, { current: current })
  }

  public async findByCircleId(circleId: string): Promise<DeploymentEntityV2> {
    return await this.createQueryBuilder('v2deployments')
      .where({ circleId: circleId, current: true })
      .getOneOrFail()
  }
  public async findCurrentsByCirclesIds(circlesIds: string[]): Promise<DeploymentEntityV2[]> {
    return await this.createQueryBuilder('v2deployments')
      .where( { circleId: In(circlesIds) })
      .andWhere('v2deployments.current = true')
      .getMany()
  }
}
