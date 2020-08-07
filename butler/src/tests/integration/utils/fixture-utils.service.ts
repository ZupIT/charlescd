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
import { ComponentEntity } from '../../../app/v1/api/components/entity'
import { CdConfigurationEntity } from '../../../app/v1/api/configurations/entity'
import { CdConfigurationsRepository } from '../../../app/v1/api/configurations/repository'
import {
  ComponentDeploymentEntity, ComponentUndeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity, ModuleUndeploymentEntity,
  QueuedDeploymentEntity, QueuedIstioDeploymentEntity, QueuedUndeploymentEntity, UndeploymentEntity
} from '../../../app/v1/api/deployments/entity'
import { ModuleEntity } from '../../../app/v1/api/modules/entity'
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
      { name: 'UndeploymentEntity', tableName: 'undeployments' },
      { name: 'Execution', tableName: 'v2executions' },
      { name: 'DeploymentEntity', tableName: 'v2deployments' },
      { name: 'ComponentEntity', tableName: 'v2components' },
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

  public async createDeployment(
    deploymentRequest: Record<string, unknown>
  ): Promise<DeploymentEntity> {
    const deployment = this.manager.create(DeploymentEntity, deploymentRequest)
    return this.manager.save(deployment)
  }

  public async createV2CircleDeployment(
    deploymentRequest: CreateDeploymentRequestDto,
    incomingCircleId: string
  ): Promise<DeploymentEntityV2> {
    const deployment = this.manager.create(DeploymentEntityV2, deploymentRequest.toCircleEntity(incomingCircleId))
    return this.manager.save(deployment)
  }

  public async createV2DefaultDeployment(
    deploymentRequest: CreateDeploymentRequestDto,
    incomingCircleId: string | null,
    unchangedComponents: ComponentEntityV2[]
  ): Promise<DeploymentEntityV2> {
    const deployment = this.manager.create(DeploymentEntityV2, deploymentRequest.toDefaultEntity(incomingCircleId, unchangedComponents))
    return this.manager.save(deployment)
  }

  public async createModuleDeployment(
    moduleDeploymentRequest: Record<string, unknown>
  ): Promise<ModuleDeploymentEntity> {
    const moduleDeployment = this.manager.create(ModuleDeploymentEntity, moduleDeploymentRequest)
    return this.manager.save(moduleDeployment)
  }

  public async createModuleUndeployment(
    moduleUndeploymentRequest: Record<string, unknown>
  ): Promise<ModuleUndeploymentEntity> {
    const moduleUndeployment = this.manager.create(ModuleUndeploymentEntity, moduleUndeploymentRequest)
    return this.manager.save(moduleUndeployment)
  }

  public async createModule(
    moduleRequest: Record<string, unknown>
  ): Promise<ModuleEntity> {
    const module = this.manager.create(ModuleEntity, moduleRequest)
    return this.manager.save(module)
  }

  public async createComponent(
    componentRequest: Record<string, unknown>
  ): Promise<ComponentEntity> {
    const component = this.manager.create(ComponentEntity, componentRequest)
    return this.manager.save(component)
  }

  public async createComponentDeployment(
    componentDeploymentRequest: Record<string, unknown>
  ): Promise<ComponentDeploymentEntity> {
    const componentDeployment = this.manager.create(ComponentDeploymentEntity, componentDeploymentRequest)
    return await this.manager.save(componentDeployment)
  }

  public async createComponentUndeployment(
    componentUndeploymentRequest: Record<string, unknown>
  ): Promise<ComponentUndeploymentEntity> {
    const componentUndeployment = this.manager.create(ComponentUndeploymentEntity, componentUndeploymentRequest)
    return await this.manager.save(componentUndeployment)
  }

  public async createQueuedDeployment(
    queuedDeploymentRequest: Record<string, unknown>
  ): Promise<QueuedDeploymentEntity> {
    const queuedDeployment = this.manager.create(QueuedDeploymentEntity, queuedDeploymentRequest)
    return await this.manager.save(queuedDeployment)
  }

  public async createQueuedUndeployment(
    queuedUndeploymentRequest: Record<string, unknown>
  ): Promise<QueuedUndeploymentEntity> {
    const queuedUndeployment = this.manager.create(QueuedUndeploymentEntity, queuedUndeploymentRequest)
    return await this.manager.save(queuedUndeployment)
  }

  public async createQueuedIstioDeployment(
    queuedIstioDeploymentRequest: Record<string, unknown>
  ): Promise<QueuedIstioDeploymentEntity> {
    const queuedIstioDeployment = this.manager.create(QueuedIstioDeploymentEntity, queuedIstioDeploymentRequest)
    return await this.manager.save(queuedIstioDeployment)
  }

  public async createUndeployment(
    undeploymentRequest: Record<string, unknown>
  ): Promise<UndeploymentEntity> {
    const undeployment = this.manager.create(UndeploymentEntity, undeploymentRequest)
    return await this.manager.save(undeployment)
  }

}
