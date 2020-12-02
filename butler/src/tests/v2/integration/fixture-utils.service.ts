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

import { Inject, Injectable } from '@nestjs/common'
import { Connection, EntityManager } from 'typeorm'
import { CdConfigurationEntity } from '../../../app/v1/api/configurations/entity'
import { CdConfigurationsRepository } from '../../../app/v1/api/configurations/repository'
import { CreateDeploymentRequestDto } from '../../../app/v2/api/deployments/dto/create-deployment-request.dto'
import { ComponentEntityV2 } from '../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../app/v2/api/deployments/entity/deployment.entity'

interface DatabaseEntity {
  name: string,
  tableName: string
}
@Injectable()
export class FixtureUtilsService {
  constructor(
    @Inject('Connection') public connection: Connection,
    private readonly manager: EntityManager
  ) {
  }

  public async clearDatabase(): Promise<void> {
    try {
      const entities: DatabaseEntity[] = this.getOrderedClearDbEntities()
      for (const entity of entities) {
        const repository = await this.connection.getRepository(entity.name)
        await repository.query(`TRUNCATE ${entity.tableName} CASCADE;`)
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`)
    }
  }

  private getOrderedClearDbEntities(): DatabaseEntity[] {
    return [
      { name: 'CdConfigurationEntity', tableName: 'cd_configurations' },
      { name: 'Execution', tableName: 'v2executions' },
      { name: 'DeploymentEntityV2', tableName: 'v2deployments' },
      { name: 'ComponentEntityV2', tableName: 'v2components' },
    ]
  }

  public async createCdConfiguration(
    cdConfigurationRequest: Record<string, unknown>
  ): Promise<CdConfigurationEntity> {
    const cdConfiguration = this.manager.create(CdConfigurationEntity, cdConfigurationRequest)
    return this.manager.save(cdConfiguration)
  }

  public async createEncryptedConfiguration(cdConfig: CdConfigurationEntity) : Promise<CdConfigurationEntity>{
    const configRepo = this.manager.getCustomRepository<CdConfigurationsRepository>(CdConfigurationsRepository)
    return configRepo.saveEncrypted(cdConfig)
  }

  public async createV2CircleDeployment(
    deploymentRequest: CreateDeploymentRequestDto
  ): Promise<DeploymentEntityV2> {
    const deployment = this.manager.create(DeploymentEntityV2, deploymentRequest.toCircleEntity())
    return this.manager.save(deployment)
  }

  public async createV2DefaultDeployment(
    deploymentRequest: CreateDeploymentRequestDto,
    unchangedComponents: ComponentEntityV2[]
  ): Promise<DeploymentEntityV2> {
    const deployment = this.manager.create(DeploymentEntityV2, deploymentRequest.toDefaultEntity(unchangedComponents))
    return this.manager.save(deployment)
  }


}
