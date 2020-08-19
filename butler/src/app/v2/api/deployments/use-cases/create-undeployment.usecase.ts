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
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { PgBossWorker } from '../jobs/pgboss.worker'
import { ComponentsRepositoryV2 } from '../repository'
import { ExecutionTypeEnum } from '../enums'
import { ReadUndeploymentDto } from '../dto/read-undeployment.dto'

@Injectable()
export class CreateUndeploymentUseCase {
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

  public async execute(
    deploymentId: string,
    incomingCircleId: string | null
  ): Promise<ReadUndeploymentDto> {

    this.consoleLoggerService.log('START:EXECUTE_V2_CREATE_UNDEPLOYMENT_USECASE', { deploymentId, incomingCircleId })
    const execution = await this.createExecution(deploymentId, incomingCircleId)
    const jobId = await this.publishExecutionJob(execution)
    this.consoleLoggerService.log('FINISH:EXECUTE_V2_CREATE_UNDEPLOYMENT_USECASE', { execution, jobId })
    return { id: deploymentId }
  }

  private async createExecution(deploymentId: string, incomingCircleId: string | null): Promise<Execution> {
    this.consoleLoggerService.log('START:CREATE_UNDEPLOYMENT_EXECUTION', { deployment: deploymentId })
    const deployment = await this.deploymentsRepository.findOneOrFail({ id: deploymentId })
    const execution = await this.executionRepository.save({ deployment, type: ExecutionTypeEnum.UNDEPLOYMENT, incomingCircleId })
    this.consoleLoggerService.log('FINISH:CREATE_UNDEPLOYMENT_EXECUTION', { execution })
    return execution
  }

  private async publishExecutionJob(execution: Execution): Promise<string | null> {
    this.consoleLoggerService.log('START:PUBLISHING_UNDEPLOYMENT_EXECUTION', { execution: execution.id })
    const jobId = await this.pgBoss.publish(execution)
    this.consoleLoggerService.log('FINISH:PUBLISHING_UNDEPLOYMENT_EXECUTION', { jobId: jobId, executions: execution.id })
    return jobId
  }
}
