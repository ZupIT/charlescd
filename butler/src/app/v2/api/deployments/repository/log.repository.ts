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
import { LogEntity } from '../entity/logs.entity'

@EntityRepository(LogEntity)
export class LogRepository extends Repository<LogEntity> {

  public async findDeploymentLogs(deploymentId: string): Promise<LogEntity | undefined> {
    return this.createQueryBuilder('v2logs')
      .leftJoinAndSelect('v2logs.deployment', 'deployment')
      .andWhere('deployment.id = :deploymentId', { deploymentId })
      .getOne()
  }

}
