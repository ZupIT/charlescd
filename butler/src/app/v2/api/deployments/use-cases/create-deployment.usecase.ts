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

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { flatten } from 'lodash'
import { EntityManager, getConnection, Repository, UpdateResult } from 'typeorm'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { ConsoleLoggerService } from '../../../core/logs/console/console-logger.service'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { ReadDeploymentDto } from '../dto/read-deployment.dto'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { ExecutionTypeEnum } from '../enums'
import { ComponentsRepositoryV2 } from '../repository'
import { K8sClient } from '../../../core/integrations/k8s/client'
import { IDefaultConfig } from '../../configurations/interfaces/octopipe-configuration-data.type'
import { RepoConfig } from '../../../core/manifests/manifest.interface'
import { HelmManifest } from '../../../core/manifests/helm/helm-manifest'
import { CreateModuleDeploymentDto } from '../dto/create-module-request.dto'
import { KubernetesManifest } from '../../../core/integrations/interfaces/k8s-manifest.interface'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'

@Injectable()
export class CreateDeploymentUseCase {

  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(Execution)
    private executionRepository: Repository<Execution>,
    @InjectRepository(ComponentsRepositoryV2)
    private componentsRepository: ComponentsRepositoryV2,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly k8sClient: K8sClient,
    private readonly helmManifest: HelmManifest
  ) { }

  public async execute(createDeploymentDto: CreateDeploymentRequestDto, incomingCircleId: string | null): Promise<ReadDeploymentDto> {
    this.consoleLoggerService.log('START:EXECUTE_V2_CREATE_DEPLOYMENT_USECASE', { deployment: createDeploymentDto.deploymentId, incomingCircleId })
    const { deployment, execution } = await getConnection().transaction(async transactionManager => {
      const deploymentEntity = await this.newDeployment(createDeploymentDto)
      const previousDeployment = await this.deactivateCurrentCircle(createDeploymentDto.circle.headerValue, transactionManager)
      deploymentEntity.previousDeploymentId = previousDeployment
      const deployment = await transactionManager.save(deploymentEntity)
      const execution = await this.createExecution(deployment, incomingCircleId, transactionManager)
      return { deployment, execution }
    })
    try {
      await this.k8sClient.applyDeploymentCustomResource(deployment)
    } catch (error) {
      this.consoleLoggerService.log('DEPLOYMENT_CRD_ERROR', { error: error })
    }
    this.consoleLoggerService.log('FINISH:EXECUTE_V2_CREATE_DEPLOYMENT_USECASE', { deployment: deployment.id, execution: execution.id })
    const reloadedDeployment = await this.deploymentsRepository.findOneOrFail(deployment.id, { relations: ['components', 'executions', 'cdConfiguration'] })
    return reloadedDeployment.toReadDto() // BUG typeorm https://github.com/typeorm/typeorm/issues/4090
  }

  private async newDeployment(createDeploymentDto: CreateDeploymentRequestDto): Promise<DeploymentEntity> {
    return createDeploymentDto.defaultCircle ?
      await this.createDefaultDeployment(createDeploymentDto) :
      await this.createCircleDeployment(createDeploymentDto)
  }

  private async createCircleDeployment(createDeploymentDto: CreateDeploymentRequestDto): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:CREATE_CIRCLE_DEPLOYMENT')
    const cdConfig = createDeploymentDto.cdConfiguration.configurationData as IDefaultConfig
    const components = await this.getDeploymentComponents(cdConfig, createDeploymentDto.circle.headerValue, createDeploymentDto.modules)
    const deployment = createDeploymentDto.toCircleEntity(components)
    deployment.active = true
    this.consoleLoggerService.log('FINISH:CREATE_CIRCLE_DEPLOYMENT')
    return deployment
  }

  private async deactivateCurrentCircle(circleId: string, transactionManager: EntityManager): Promise<string | null> {
    // here we can put the logic to make the deployment aditive or replace current active components, right now its just set current as active but possible
    // bugs will happen as Im not taking in account the activeComponents query to generate the routes manifest
    const updatedDeployment = await transactionManager
      .createQueryBuilder(DeploymentEntity, 'd')
      .update()
      .set({ active: false })
      .where('circle_id = :circleId', { circleId: circleId })
      .where('active = true')
      .returning('id')
      .execute()

    if (updatedDeployment.raw.length === 0) {
      return null
    }
    return updatedDeployment.raw[0].id
  }

  private async createDefaultDeployment(createDeploymentDto: CreateDeploymentRequestDto): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT')
    const activeComponents: ComponentEntity[] = await this.componentsRepository.findDefaultActiveComponents(
      createDeploymentDto.circle.headerValue
    )
    const requestedComponentsNames: string[] = this.getDeploymentRequestComponentNames(createDeploymentDto)
    const unchangedComponents: ComponentEntity[] = activeComponents
      .filter(component => !requestedComponentsNames.includes(component.name))
      .map(component => component.clone())
    this.consoleLoggerService.log('GET:UNCHANGED_DEFAULT_ACTIVE_COMPONENTS', { unchangedComponents })

    const cdConfig = createDeploymentDto.cdConfiguration.configurationData as IDefaultConfig
    const components = await this.getDeploymentComponents(cdConfig, createDeploymentDto.circle.headerValue, createDeploymentDto.modules)
    const deployment = createDeploymentDto.toDefaultEntity(unchangedComponents, components)
    deployment.active = true
    this.consoleLoggerService.log('FINISH:CREATE_DEFAULT_DEPLOYMENT')
    return deployment
  }

  private async getDeploymentComponents(config: IDefaultConfig, circleId: string, modules: CreateModuleDeploymentDto[]): Promise<ComponentEntity[]> {
    this.consoleLoggerService.log('START:CREATE_MANIFESTS')
    const components =
      await Promise.all(modules.map(async module =>
        Promise.all(module.components.map(async component => {
          const manifests = await this.getManifestsFor(config, circleId, module.helmRepository, component)
          return component.toEntity(module.helmRepository, manifests)
        }))
      ))
    this.consoleLoggerService.log('FINISH:CREATE_MANIFESTS')
    return flatten(components)
  }

  private async getManifestsFor(cdConfig: IDefaultConfig,
    circleId: string,
    repoUrl: string,
    component: CreateComponentRequestDto
  ): Promise<KubernetesManifest[]> {
    const repoConfig = this.getRepoConfig(cdConfig, repoUrl)
    const manifestConfig = {
      repo: repoConfig,
      componentName: component.componentName,
      imageUrl: component.buildImageUrl,
      namespace: cdConfig.namespace,
      circleId: circleId
    }
    // TODO: utilizar aqui a interface Manifest e obter de um factory
    return this.helmManifest.generate(manifestConfig)
  }

  private getRepoConfig(cdConfig: IDefaultConfig, repoUrl: string): RepoConfig {
    return {
      provider: cdConfig.gitProvider,
      url: repoUrl,
      token: cdConfig.gitToken,
      branch: 'master' // TODO obter branch
    }
  }

  private async createExecution(deployment: DeploymentEntity, incomingCircleId: string | null, manager: EntityManager): Promise<Execution> {
    this.consoleLoggerService.log('START:CREATE_DEPLOYMENT_EXECUTION', { deployment: deployment.id })
    const executionEntity = new Execution(deployment, ExecutionTypeEnum.DEPLOYMENT, incomingCircleId, DeploymentStatusEnum.CREATED)
    const execution = await manager.save(executionEntity)
    this.consoleLoggerService.log('FINISH:CREATE_DEPLOYMENT_EXECUTION', { execution: execution.id })
    return execution
  }

  private getDeploymentRequestComponentNames(createDeploymentDto: CreateDeploymentRequestDto): string[] {
    return flatten(createDeploymentDto.modules.map(module => module.components)).map(component => component.componentName)
  }
}
