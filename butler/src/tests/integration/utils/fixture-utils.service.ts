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
import * as uuid from 'uuid'
import { plainToClass } from 'class-transformer'
import {
  ComponentDeploymentEntity, ComponentUndeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity, ModuleUndeploymentEntity,
  QueuedDeploymentEntity, QueuedIstioDeploymentEntity, QueuedUndeploymentEntity, UndeploymentEntity
} from '../../../app/api/deployments/entity'
import { CdConfigurationEntity } from '../../../app/api/configurations/entity'
import { ComponentEntity } from '../../../app/api/components/entity'
import { ModuleEntity } from '../../../app/api/modules/entity'

interface DatabaseEntity {
    name: string,
    tableName: string
}
@Injectable()
export class FixtureUtilsService {

  constructor(
        @Inject('Connection') public connection: Connection
  ) {}

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
  async insertSingleFixture(entity: DatabaseEntity, params: Record<string, unknown>) : Promise<Record<string, unknown>> {
    const repository =  await this.connection.getRepository(entity.name)
    return await repository
      .save(
        params
      )

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

  public async createCdConfigurationOctopipe(): Promise<CdConfigurationEntity> {

    const databaseEntity = {
      name: 'CdConfigurationEntity',
      tableName: 'cd_configurations'
    }

    const createCdConfiguration = {
      id: uuid.v4(),
      workspaceId: uuid.v4(),
      type: 'OCTOPIPE',
      configurationData: '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      name: 'config-name',
      authorId: 'author'
    }

    const insertion = await this.insertSingleFixture(databaseEntity, createCdConfiguration)
    return plainToClass(CdConfigurationEntity, insertion)
  }

  public async createCircleDeployment(cdConfigurationId: unknown): Promise<DeploymentEntity> {

    const databaseEntity = {
      name: 'DeploymentEntity',
      tableName: 'deployments'
    }
    const createDeploymentDB = {

      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': false,
      'cdConfigurationId': cdConfigurationId,
      'circle' : {
        'headerValue' : 'headerValue'
      }
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createDeploymentDB)
    return plainToClass(DeploymentEntity, insertion)
  }

  public async createDefaultDeployment(cdConfigurationId: unknown) : Promise<DeploymentEntity> {

    const databaseEntity = {
      name: 'DeploymentEntity',
      tableName: 'deployments'
    }

    const createDeploymentDB = {
      'id': uuid.v4(),
      'applicationName': 'application-name',
      'authorId': 'author-id',
      'description': 'fake deployment ',
      'callbackUrl': 'callback-url',
      'status': 'CREATED',
      'defaultCircle': true,
      'cdConfigurationId': cdConfigurationId,
      'circle': null
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createDeploymentDB)
    return plainToClass(DeploymentEntity, insertion)
  }

  public async createModuleDeployment(
    deploymentId: unknown,
    moduleId: unknown,
    status: string): Promise<ModuleDeploymentEntity> {
    const databaseEntity = {
      name: 'ModuleDeploymentEntity',
      tableName: 'module_deployments'
    }
    const createModuleDeployment = {
      'id': uuid.v4(),
      'deployment': deploymentId,
      'moduleId': moduleId,
      'status': status,
      'helmRepository': 'helm-repository'
    }

    const insertion = await this.insertSingleFixture(databaseEntity, createModuleDeployment)
    return plainToClass(ModuleDeploymentEntity, insertion)
  }

  public async createModuleUndeployment(
    undeploymentId: unknown,
    moduleDeployment: unknown
  ): Promise<ModuleUndeploymentEntity> {

    const databaseEntity = {
      name: 'ModuleUndeploymentEntity',
      tableName: 'module_undeploymen1ts'
    }

    const createModuleUndeployment = {
      'id': uuid.v4(),
      'undeployment': undeploymentId,
      'moduleDeployment': moduleDeployment,
      'status': 'CREATED'
    }

    const insertion = await this.insertSingleFixture(databaseEntity, createModuleUndeployment)
    return plainToClass(ModuleUndeploymentEntity, insertion)
  }

  public async createModule(): Promise<ModuleEntity> {
    const databaseEntity = {
      name: 'ModuleEntity',
      tableName: 'modules'
    }
    const createModule = {
      'id': uuid.v4()
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createModule)
    return plainToClass(ModuleEntity, insertion)
  }

  public async createComponent(moduleId: unknown) : Promise<ComponentEntity> {
    const databaseEntity = {
      name: 'ComponentEntity',
      tableName: 'components'
    }
    const createComponent = {
      'id': uuid.v4(),
      'module': moduleId,
      'pipelineOptions': { 'pipelineCircles': [], 'pipelineVersions': [], 'pipelineUnusedVersions': [] }
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createComponent)
    return plainToClass(ComponentEntity, insertion)
  }

  public async createComponentDeployment(
    moduleDeploymentId: unknown,
    componentId: unknown,
    name: string,
    status: string
  ): Promise<ComponentDeploymentEntity> {
    const databaseEntity = {
      name: 'ComponentDeploymentEntity',
      tableName: 'component_deployments'
    }
    const createComponentDeployment = {
      'id': uuid.v4(),
      'moduleDeployment': moduleDeploymentId,
      'componentId':  componentId,
      'buildImageUrl': 'build-image-url',
      'buildImageTag': 'build-image-tag',
      'componentName': name,
      'status': status
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createComponentDeployment)
    return plainToClass(ComponentDeploymentEntity, insertion)
  }

  public async createComponentUndeployment(
    moduleUndeploymentId: string,
    componentDeploymentId: string,
  ): Promise<ComponentUndeploymentEntity> {

    const databaseEntity = {
      name: 'ComponentUndeploymentEntity',
      tableName: 'component_undeployments'
    }

    const createComponentUndeployment = {
      'id': uuid.v4(),
      'moduleUndeployment': moduleUndeploymentId,
      'componentDeployment':  componentDeploymentId,
      'status': 'CREATED'
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createComponentUndeployment)
    return plainToClass(ComponentUndeploymentEntity, insertion)
  }

  public async createQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: string
  ): Promise<QueuedDeploymentEntity> {
    const databaseEntity = {
      name: 'QueuedDeploymentEntity',
      tableName: 'queued_deployments'
    }
    const createQueuedDeployment = {
      componentId: componentId,
      componentDeploymentId: componentDeploymentId,
      status: status,
      type: 'QueuedDeploymentEntity'
    }

    const insertion = await this.insertSingleFixture(databaseEntity, createQueuedDeployment)
    return plainToClass(QueuedDeploymentEntity, insertion)
  }

  public async createQueuedUndeployment(
    componentId: string,
    componentDeploymentId: string,
    status: string,
    componentUndeploymentId: string
  ): Promise<QueuedUndeploymentEntity> {
    const databaseEntity = {
      name: 'QueuedUndeploymentEntity',
      tableName: 'queued_deployments'
    }
    const createQueuedUndeployment = {
      'componentId': componentId,
      'componentDeploymentId': componentDeploymentId,
      'status': 'RUNNING',
      'type': 'QueuedUndeploymentEntity',
      'componentUndeploymentId': componentUndeploymentId
    }

    const insertion = await this.insertSingleFixture(databaseEntity, createQueuedUndeployment)
    return plainToClass(QueuedUndeploymentEntity, insertion)
  }

  public async createQueuedIstioDeployment(
    deploymentId: string,
    componentId: string,
    componentDeploymentId: string,
    status: string
  ): Promise<QueuedIstioDeploymentEntity> {
    const databaseEntity = {
      name: 'QueuedIstioDeploymentEntity',
      tableName: 'queued_istio_deployments'
    }

    const createQueuedIstioDeployment = {
      'deploymentId': deploymentId,
      'componentId': componentId,
      'componentDeploymentId': componentDeploymentId,
      'status': status,
      'type': 'QueuedIstioDeploymentEntity'
    }
    const insertion = await this.insertSingleFixture(databaseEntity, createQueuedIstioDeployment)
    return plainToClass(QueuedIstioDeploymentEntity, insertion)
  }

  public async createUndeployment(
    deploymentId: string
  ): Promise<UndeploymentEntity> {

    const databaseEntity = {
      name: 'UndeploymentEntity',
      tableName: 'undeployments'
    }

    const createUndeployment = 
    {
      'id': uuid.v4(),
      'deployment': deploymentId,
      'authorId': 'author-id',
      'status': 'CREATED',
      'circleId': '123456'
    }

    const insertion = await this.insertSingleFixture(databaseEntity, createUndeployment)
    return plainToClass(UndeploymentEntity, insertion)
  }
  
}
