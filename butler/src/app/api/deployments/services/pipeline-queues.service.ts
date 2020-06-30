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

import { forwardRef, Inject, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentEntity } from '../../components/entity'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity,
  UndeploymentEntity,
  QueuedIstioDeploymentEntity
} from '../entity'
import { QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../enums'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository,
  QueuedIstioDeploymentsRepository
} from '../repository'
import { PipelineDeploymentsService } from './'

@Injectable()
export class PipelineQueuesService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(QueuedUndeploymentEntity)
    private readonly queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(ComponentUndeploymentsRepository)
    private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @Inject(forwardRef(() => PipelineDeploymentsService))
    private readonly pipelineDeploymentsService: PipelineDeploymentsService,
    @InjectRepository(UndeploymentEntity)
    private readonly undeploymentsRepository: Repository<UndeploymentEntity>,
    @InjectRepository(QueuedIstioDeploymentsRepository)
    private readonly queuedIstioDeploymentsRepository: QueuedIstioDeploymentsRepository,

  ) { }

  public async triggerNextComponentPipeline(finishedComponentDeployment: ComponentDeploymentEntity): Promise<void> {
    const nextQueuedDeployment: QueuedDeploymentEntity | undefined =
      await this.queuedDeploymentsRepository.getNextQueuedDeployment(finishedComponentDeployment.componentId)
    const runningDeployment: QueuedDeploymentEntity | undefined =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(finishedComponentDeployment.componentId)

      if (nextQueuedDeployment && !runningDeployment) {
      nextQueuedDeployment.type === QueuedPipelineTypesEnum.QueuedDeploymentEntity ?
        await this.triggerQueuedDeployment(nextQueuedDeployment) :
        await this.triggerQueuedUndeployment(nextQueuedDeployment as QueuedUndeploymentEntity)
      await this.setQueuedDeploymentStatus(nextQueuedDeployment, QueuedPipelineStatusEnum.RUNNING)
    }
  }

  public async triggerAllIstioDeployments(deploymentId: string): Promise<void> {
    const istioQueuedDeployments: QueuedIstioDeploymentEntity[] = await this.queuedIstioDeploymentsRepository.find({
      where: { deploymentId },
    })

    await Promise.all(istioQueuedDeployments?.map(
      istioDeployment => this.triggerQueuedIstioDeployment(istioDeployment)
    ))
  }

  private async triggerQueuedIstioDeployment(queuedIstioDeployment: QueuedIstioDeploymentEntity): Promise<void> {
    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(queuedIstioDeployment.componentDeploymentId)

    const component: ComponentEntity =
      await this.componentsRepository.findOneOrFail({ id: componentDeployment.componentId }, { relations: ['module'] })

    const { moduleDeployment: { deployment } } = componentDeployment

    await this.queuedIstioDeploymentsRepository.update(
      { id: queuedIstioDeployment.id }, { status: QueuedPipelineStatusEnum.RUNNING }
    )

    !deployment.circle ?
      await this.pipelineDeploymentsService.triggerIstioDefaultDeployment(componentDeployment, component, deployment, queuedIstioDeployment) :
      await this.pipelineDeploymentsService.triggerIstioDeployment(componentDeployment, component, deployment, queuedIstioDeployment, deployment.circle)
  }

  private async triggerQueuedDeployment(queuedDeployment: QueuedDeploymentEntity): Promise<void> {
    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(queuedDeployment.componentDeploymentId)

    const component: ComponentEntity =
      await this.componentsRepository.findOneOrFail({ id: componentDeployment.componentId }, { relations: ['module'] })

    const { moduleDeployment: { deployment } } = componentDeployment
    !deployment.circle ?
      await this.pipelineDeploymentsService.triggerDefaultDeployment(componentDeployment, component, deployment, queuedDeployment) :
      await this.pipelineDeploymentsService.triggerCircleDeployment(componentDeployment, component, deployment, queuedDeployment, deployment.circle)
  }

  private async triggerQueuedUndeployment(queuedUndeployment: QueuedUndeploymentEntity): Promise<void> {
    const componentDeployment: ComponentDeploymentEntity
      = await this.componentDeploymentsRepository.getOneWithRelations(queuedUndeployment.componentDeploymentId)
    const component: ComponentEntity =
      await this.componentsRepository.findOneOrFail({ id: componentDeployment.componentId }, { relations: ['module'] })
    const componentUndeployment: ComponentUndeploymentEntity =
      await this.componentUndeploymentsRepository.getOneWithRelations(queuedUndeployment.componentUndeploymentId)

    const { moduleDeployment: { deployment } } = componentDeployment
    const undeployment = await this.undeploymentsRepository.findOneOrFail(
      { id: componentUndeployment.moduleUndeployment.undeployment.id },
      { relations: ['deployment'] }
    )
    if (!deployment.circle) {
      this.consoleLoggerService.error('ERROR:CANNOT_PERFORM_UNDEPLOYMENT_WITHOUT_CIRCLE', deployment)
      throw new BadRequestException('Cannot perform undeployment without a circle')
    }
    await this.pipelineDeploymentsService.triggerUndeployment(componentDeployment, undeployment, component, queuedUndeployment, deployment.circle)
  }

  private async setQueuedDeploymentStatus(queuedDeployment: QueuedDeploymentEntity, status: QueuedPipelineStatusEnum): Promise<void> {
    try {
      await this.queuedDeploymentsRepository.update(
        { id: queuedDeployment.id }, { status }
      )
    } catch (error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_UPDATE_QUEUED_DEPLOYMENT_STATUS', error)
      throw new InternalServerErrorException('Could not update queued deployment status')
    }
  }

  public async getComponentDeploymentQueue(componentId: string): Promise<QueuedDeploymentEntity[]> {
    return this.queuedDeploymentsRepository.getAllByComponentIdAscending(componentId)
  }

  public async setQueuedDeploymentStatusFinished(queuedDeploymentId: number): Promise<void> {
    await this.queuedDeploymentsRepository.update(
      { id: queuedDeploymentId }, { status: QueuedPipelineStatusEnum.FINISHED }
    )
  }

  public async setQueuedIstioDeploymentStatusFinished(queuedIstioDeploymentId: number): Promise<void> {
    await this.queuedIstioDeploymentsRepository.update(
      { id: queuedIstioDeploymentId }, { status: QueuedPipelineStatusEnum.FINISHED }
    )
  }

  public async setQueuedUndeploymentStatusFinished(queuedUndeploymentId: number): Promise<void> {
    await this.queuedUndeploymentsRepository.update(
      { id: queuedUndeploymentId }, { status: QueuedPipelineStatusEnum.FINISHED }
    )
  }

  public async getQueuedPipelineStatus(componentId: string): Promise<QueuedPipelineStatusEnum> {
    const runningDeployment: QueuedDeploymentEntity | undefined =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(componentId)

    return runningDeployment ?
      QueuedPipelineStatusEnum.QUEUED :
      QueuedPipelineStatusEnum.RUNNING
  }
}
