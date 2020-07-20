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
import { Connection } from 'typeorm'
import * as Path from 'path'
import * as fs from 'fs'

interface DatabaseEntity {
    name: string,
    tableName: string
}
@Injectable()
export class FixtureUtilsService {

  constructor(
        @Inject('Connection') public connection: Connection
  ) {}

  public async loadDatabase(): Promise<void> {
    try {
      const entities = this.getOrderedLoadDbEntities()
      for (const entity of entities) {
        await this.insertFixture(entity)
      }
    } catch (error) {
      throw new Error(`ERROR: Loading fixtures on test db: ${error}`)
    }
  }

  public async clearDatabase(): Promise<void> {
    try {
      const entities: DatabaseEntity[] = this.getOrderedClearDbEntities()
      for (const entity of entities) {
        const repository = await this.connection.getRepository(entity.name)
        await repository.query(`DELETE FROM ${entity.tableName};`)
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`)
    }
  }

  private async insertFixture(entity: DatabaseEntity): Promise<void> {
    const repository = await this.connection.getRepository(entity.name)
    const fixtureFile = Path.join(__dirname, `../fixtures/${entity.tableName}.json`)
    if (fs.existsSync(fixtureFile)) {
      const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'))
      await repository
        .createQueryBuilder(entity.name)
        .insert()
        .values(items)
        .execute()
    }
  }

  private getOrderedLoadDbEntities(): DatabaseEntity[] {
    return [
      { name: 'CdConfigurationEntity', tableName: 'cd_configurations' },
      { name: 'ModuleEntity', tableName: 'modules' },
      { name: 'ComponentEntity', tableName: 'components' },
      { name: 'DeploymentEntity', tableName: 'deployments' },
      { name: 'QueuedDeploymentEntity', tableName: 'queued_deployments' },
      { name: 'QueuedUndeploymentEntity', tableName: 'queued_undeployments' },
      { name: 'QueuedIstioDeploymentEntity', tableName: 'queued_istio_deployments' },
      { name: 'ModuleDeploymentEntity', tableName: 'module_deployments' },
      { name: 'ComponentDeploymentEntity', tableName: 'component_deployments' },
      { name: 'ComponentUndeploymentEntity', tableName: 'component_undeployments' },
      { name: 'ModuleUndeploymentEntity', tableName: 'module_undeployments' },
      { name: 'UndeploymentEntity', tableName: 'undeployments' }
    ]
  }

  private getOrderedClearDbEntities(): DatabaseEntity[] {
    return [
      { name: 'ComponentDeploymentEntity', tableName: 'component_deployments' },
      { name: 'ModuleDeploymentEntity', tableName: 'module_deployments' },
      { name: 'DeploymentEntity', tableName: 'deployments' },
      { name: 'ModuleEntity', tableName: 'modules' },
      { name: 'CdConfigurationEntity', tableName: 'cd_configurations' },
      { name: 'ComponentEntity', tableName: 'components' },
      { name: 'QueuedDeploymentEntity', tableName: 'queued_deployments' },
      { name: 'QueuedUndeploymentEntity', tableName: 'queued_deployments' },
      { name: 'QueuedIstioDeploymentEntity', tableName: 'queued_istio_deployments' },
      { name: 'ComponentUndeploymentEntity', tableName: 'component_undeployments' },
      { name: 'ModuleUndeploymentEntity', tableName: 'module_undeployments' },
      { name: 'UndeploymentEntity', tableName: 'undeployments' }
    ]
  }
}
