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
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { PgBossWorker } from '../jobs/pgboss.worker'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { ComponentsRepositoryV2 } from '../repository'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { ExecutionTypeEnum } from '../enums'

@Injectable()
export class CreateDeploymentUseCase {
  constructor(
      @InjectRepository(DeploymentEntity)
      private deploymentsRepository: Repository<DeploymentEntity>,
      @InjectRepository(Execution)
      private executionRepository: Repository<Execution>,
      @InjectRepository(ComponentsRepositoryV2)
      private componentsRepository: ComponentsRepositoryV2,
      private pgBoss: PgBossWorker,
      private readonly consoleLoggerService: ConsoleLoggerService
  ) {}

  public async execute(createDeploymentDto: CreateDeploymentRequestDto, incomingCircleId: string): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:EXECUTE_V2_CREATE_DEPLOYMENT_USECASE', { createDeploymentDto, incomingCircleId })
    const deployment = createDeploymentDto.circle ?
      await this.createCircleDeployment(createDeploymentDto, incomingCircleId) :
      await this.createDefaultDeployment(createDeploymentDto, incomingCircleId)
    const execution = await this.createDeploymentExecution(deployment)
    const jobId = await this.publishExecutionJob(execution)
    this.consoleLoggerService.log('FINISH:EXECUTE_V2_CREATE_DEPLOYMENT_USECASE', { deployment, execution, jobId })
    return deployment
  }

  private async createCircleDeployment(createDeploymentDto: CreateDeploymentRequestDto, incomingCircleId: string): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT')
    const deployment = await this.deploymentsRepository.save(createDeploymentDto.toCircleEntity(incomingCircleId))
    this.consoleLoggerService.log('FINISH:CREATE_DEFAULT_DEPLOYMENT')
    return deployment
  }

  private async createDefaultDeployment(createDeploymentDto: CreateDeploymentRequestDto, incomingCircleId: string): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT')
    const activeComponents: ComponentEntity[] = await this.componentsRepository.findDefaultActiveComponents()
    const requestedComponentsNames: string[] = this.getDeploymentRequestComponentNames(createDeploymentDto)
    const unchangedComponents: ComponentEntity[] = activeComponents
      .filter(component => !requestedComponentsNames.includes(component.name))
      .map(component => component.clone())
    this.consoleLoggerService.log('GET:UNCHANGED_DEFAULT_ACTIVE_COMPONENTS', { unchangedComponents })

    const deployment = await this.deploymentsRepository.save(
      createDeploymentDto.toDefaultEntity(incomingCircleId, unchangedComponents)
    )
    this.consoleLoggerService.log('FINISH:CREATE_DEFAULT_DEPLOYMENT')
    return deployment
  }

  private async publishExecutionJob(execution: Execution): Promise<string | null> {
    this.consoleLoggerService.log('START:PUBLISHING_EXECUTION', { execution: execution.id })
    const jobId = await this.pgBoss.publish(execution)
    this.consoleLoggerService.log('FINISH:PUBLISHING_EXECUTION', { jobId: jobId, executions: execution.id })
    return jobId
  }

  private async createDeploymentExecution(deployment: DeploymentEntity): Promise<Execution> {
    this.consoleLoggerService.log('START:CREATE_EXECUTION', { deployment: deployment.id })
    const execution = await this.executionRepository.save({ deployment, type: ExecutionTypeEnum.DEPLOYMENT })
    this.consoleLoggerService.log('FINISH:CREATE_EXECUTION', { execution })
    return execution
  }

  private getDeploymentRequestComponentNames(createDeploymentDto: CreateDeploymentRequestDto): string[] {
    return flatten(createDeploymentDto.modules.map(module => module.components)).map(component => component.componentName)
  }
}
