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
import { FinishDeploymentDto } from '../dto'
import {
  ComponentDeploymentEntity,
  QueuedDeploymentEntity
} from '../../deployments/entity'
import { ConsoleLoggerService } from '../../../core/logs/console'
import {
  PipelineErrorHandlerService,
  PipelineQueuesService
} from '../../deployments/services'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ComponentDeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../deployments/repository'
import { StatusManagementService } from '../../../core/services/deployments'

@Injectable()
export class ReceiveDeploymentCallbackUsecase {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
    private readonly statusManagementService: StatusManagementService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
  ) { }

  public async execute(
    queuedDeploymentId: number,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {
    this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)
    const queuedDeploymentEntity: QueuedDeploymentEntity =
      await this.queuedDeploymentsRepository.findOneOrFail({ id: queuedDeploymentId })

    try {
      if (queuedDeploymentEntity.isRunning()) {
        finishDeploymentDto.isSuccessful() ?
          await this.handleDeploymentSuccess(queuedDeploymentId) :
          await this.handleDeploymentFailure(queuedDeploymentId)
        this.consoleLoggerService.log('FINISH:FINISH_DEPLOYMENT_NOTIFICATION')
      }
    } catch (error) {
      this.consoleLoggerService.error('ERROR:FINISH_DEPLOYMENT_NOTIFICATION', error)
      throw error
    }
  }

  private async handleDeploymentFailure(
    queuedDeploymentId: number
  ): Promise<void> {

    this.consoleLoggerService.log('START:DEPLOYMENT_FAILURE_WEBHOOK', { queuedDeploymentId })
    const queuedDeployment: QueuedDeploymentEntity = await this.queuedDeploymentsRepository.findOneOrFail({ id: queuedDeploymentId })

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(queuedDeployment.componentDeploymentId)

    const { moduleDeployment: { deployment } } = componentDeployment

    await this.pipelineErrorHandlerService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment, deployment.circle)
    await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
    this.consoleLoggerService.log('FINISH:DEPLOYMENT_FAILURE_WEBHOOK', { queuedDeploymentId })
  }

  private async triggerIstioPipelines(
    componentDeploymentId: string
  ): Promise<void> {
    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const { moduleDeployment: { deployment } } = componentDeployment
    const isAllModuleFinished: boolean = await this.statusManagementService.hasAllFinishedModules(deployment.id)

    if (isAllModuleFinished) {
      await this.pipelineQueuesService.triggerAllIstioDeployments(deployment.id)
    }
  }

  private async handleDeploymentSuccess(
    queuedDeploymentId: number
  ): Promise<void> {
    this.consoleLoggerService.log('START:DEPLOYMENT_SUCCESS_WEBHOOK', { queuedDeploymentId })
    const queuedDeployment: QueuedDeploymentEntity = await this.queuedDeploymentsRepository.findOneOrFail({ id: queuedDeploymentId })

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.findOneOrFail({ id: queuedDeployment.componentDeploymentId })

    await this.pipelineQueuesService.setQueuedDeploymentStatusFinished(queuedDeploymentId)

    await this.statusManagementService.setComponentDeploymentStatusAsFinished(componentDeployment.id)
    await this.triggerIstioPipelines(componentDeployment.id)
    this.consoleLoggerService.log('FINISH:DEPLOYMENT_SUCCESS_WEBHOOK', { queuedDeploymentId })
  }
}
