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
import { K8sClient } from '../../../core/integrations/k8s/client'
import { MooveService } from '../../../core/integrations/moove/moove.service'
import { ConsoleLoggerService } from '../../../core/logs/console/console-logger.service'
import { ReadUndeploymentDto } from '../dto/read-undeployment.dto'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { ExecutionTypeEnum } from '../enums'
import { ComponentsRepositoryV2 } from '../repository'

@Injectable()
export class CreateUndeploymentUseCase {
  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(Execution)
    private executionRepository: Repository<Execution>,
    @InjectRepository(ComponentsRepositoryV2)
    private componentsRepository: ComponentsRepositoryV2,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly k8sClient: K8sClient,
    private readonly mooveService: MooveService
  ) {}

  public async execute(
    deploymentId: string,
    incomingCircleId: string | null
  ): Promise<ReadUndeploymentDto> {

    this.consoleLoggerService.log('START:EXECUTE_V2_CREATE_UNDEPLOYMENT_USECASE', { deploymentId, incomingCircleId })
    const deployment = await this.deploymentsRepository.findOneOrFail({ id: deploymentId })
    const execution = await this.createExecution(deployment, incomingCircleId)
    await this.deleteDeploymentCRD(deployment)
    this.consoleLoggerService.log('FINISH:EXECUTE_V2_CREATE_UNDEPLOYMENT_USECASE', { execution })
    return { id: deploymentId }
  }

  private async deleteDeploymentCRD(deployment: DeploymentEntity) {
    const activeComponents = await this.componentsRepository.findActiveComponents()
    try {
      await this.k8sClient.applyRoutingCustomResource(activeComponents)
      await this.k8sClient.applyUndeploymentCustomResource(deployment)
    } catch (error) {
      this.consoleLoggerService.error('ERROR_DELETING_DEPLOYMENT_CRD')
      throw error
    }
  }

  private async createExecution(deployment: DeploymentEntity, incomingCircleId: string | null): Promise<Execution> {
    this.consoleLoggerService.log('START:CREATE_UNDEPLOYMENT_EXECUTION', { deployment: deployment.id })
    const execution = await this.executionRepository.save({ deployment, type: ExecutionTypeEnum.UNDEPLOYMENT, incomingCircleId })
    await this.deploymentsRepository.update({ id: deployment.id }, { current: false, healthy: false, routed: false })
    this.consoleLoggerService.log('FINISH:CREATE_UNDEPLOYMENT_EXECUTION', { execution: execution.id })
    return execution
  }
}
