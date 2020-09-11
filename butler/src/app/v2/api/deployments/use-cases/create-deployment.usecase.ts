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
import { ReadDeploymentDto } from '../dto/read-deployment.dto'

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

  public async execute(createDeploymentDto: CreateDeploymentRequestDto, incomingCircleId: string | null): Promise<ReadDeploymentDto> {
    this.consoleLoggerService.log('START:EXECUTE_V2_CREATE_DEPLOYMENT_USECASE', { deployment: createDeploymentDto.deploymentId, incomingCircleId })
    const deployment = createDeploymentDto.circle ?
      await this.createCircleDeployment(createDeploymentDto) :
      await this.createDefaultDeployment(createDeploymentDto)
    const execution = await this.createExecution(deployment, incomingCircleId)
    const jobId = await this.publishExecutionJob(execution)
    this.consoleLoggerService.log('FINISH:EXECUTE_V2_CREATE_DEPLOYMENT_USECASE', { deployment: deployment.id, execution: execution.id, jobId: jobId })
    const reloadedDeployment = await this.deploymentsRepository.findOneOrFail(deployment.id, { relations: ['components', 'executions', 'cdConfiguration'] })
    return reloadedDeployment.toReadDto() // BUG typeorm https://github.com/typeorm/typeorm/issues/4090
  }

  private async createCircleDeployment(createDeploymentDto: CreateDeploymentRequestDto): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT')
    const deployment = await this.deploymentsRepository.save(createDeploymentDto.toCircleEntity())
    this.consoleLoggerService.log('FINISH:CREATE_DEFAULT_DEPLOYMENT')
    return deployment
  }

  private async createDefaultDeployment(createDeploymentDto: CreateDeploymentRequestDto): Promise<DeploymentEntity> {
    this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT')
    const activeComponents: ComponentEntity[] = await this.componentsRepository.findDefaultActiveComponents()
    const requestedComponentsNames: string[] = this.getDeploymentRequestComponentNames(createDeploymentDto)
    const unchangedComponents: ComponentEntity[] = activeComponents
      .filter(component => !requestedComponentsNames.includes(component.name))
      .map(component => component.clone())
    this.consoleLoggerService.log('GET:UNCHANGED_DEFAULT_ACTIVE_COMPONENTS', { unchangedComponents })

    const deployment = await this.deploymentsRepository.save(
      createDeploymentDto.toDefaultEntity(unchangedComponents)
    )
    this.consoleLoggerService.log('FINISH:CREATE_DEFAULT_DEPLOYMENT')
    return deployment
  }

  private async publishExecutionJob(execution: Execution): Promise<string | null> {
    this.consoleLoggerService.log('START:PUBLISHING_DEPLOYMENT_EXECUTION', { execution: execution.id })
    const jobId = await this.pgBoss.publish(execution)
    this.consoleLoggerService.log('FINISH:PUBLISHING_DEPLOYMENT_EXECUTION', { jobId: jobId, executions: execution.id })
    return jobId
  }

  private async createExecution(deployment: DeploymentEntity, incomingCircleId: string | null): Promise<Execution> {
    this.consoleLoggerService.log('START:CREATE_DEPLOYMENT_EXECUTION', { deployment: deployment.id })
    const execution = await this.executionRepository.save({ deployment, type: ExecutionTypeEnum.DEPLOYMENT, incomingCircleId })
    this.consoleLoggerService.log('FINISH:CREATE_DEPLOYMENT_EXECUTION', { execution: execution.id })
    return execution
  }

  private getDeploymentRequestComponentNames(createDeploymentDto: CreateDeploymentRequestDto): string[] {
    return flatten(createDeploymentDto.modules.map(module => module.components)).map(component => component.componentName)
  }
}
