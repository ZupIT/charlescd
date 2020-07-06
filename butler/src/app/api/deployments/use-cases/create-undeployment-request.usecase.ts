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

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QueuedDeploymentsConstraints } from '../../../core/integrations/databases/constraints'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentEntity } from '../../components/entity'
import { CreateUndeploymentDto, ReadUndeploymentDto } from '../dto'
import {
  CircleDeploymentEntity, ComponentDeploymentEntity, ComponentUndeploymentEntity, DeploymentEntity, QueuedUndeploymentEntity, UndeploymentEntity
} from '../entity'
import { QueuedPipelineStatusEnum } from '../enums'
import { ComponentDeploymentsRepository } from '../repository'
import { PipelineDeploymentsService, PipelineErrorHandlerService } from '../services'
import { IConstraintError } from '../interfaces/errors.interface'

@Injectable()
export class CreateUndeploymentRequestUsecase {

  constructor(
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(UndeploymentEntity)
    private readonly undeploymentsRepository: Repository<UndeploymentEntity>,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @InjectRepository(QueuedUndeploymentEntity)
    private readonly queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    private readonly pipelineDeploymentsService: PipelineDeploymentsService,
    private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async execute(createUndeploymentDto: CreateUndeploymentDto, deploymentId: string, circleId: string): Promise<ReadUndeploymentDto> {
    this.consoleLoggerService.log('START:CREATE_UNDEPLOYMENT', createUndeploymentDto)
    const undeployment = await this.saveUndeploymentRequest(createUndeploymentDto, deploymentId, circleId)
    if (!undeployment.deployment.circle) {
      this.consoleLoggerService.error('ERROR:CANNOT_PERFORM_UNDEPLOYMENT_WITHOUT_CIRCLE', undeployment)
      throw new BadRequestException('Cannot perform undeployment without a circle')
    }
    const deploymentCircle: CircleDeploymentEntity = undeployment.deployment.circle
    try {
      await this.scheduleComponentUndeployments(undeployment, deploymentCircle)
      this.consoleLoggerService.log('FINISH:CREATE_UNDEPLOYMENT', undeployment)
      return undeployment.toReadDto()
    } catch (error) {
      this.consoleLoggerService.error('ERROR:CREATE_UNDEPLOYMENT', error)
      this.pipelineErrorHandlerService.handleUndeploymentFailure(undeployment)
      throw error
    }
  }

  private async saveUndeploymentRequest(
    createUndeploymentDto: CreateUndeploymentDto,
    deploymentId: string,
    circleId: string
  ): Promise<UndeploymentEntity> {
    const deployment: DeploymentEntity = await this.deploymentsRepository.findOneOrFail({
      where: { id: deploymentId },
      relations: ['modules', 'modules.components']
    })
    try {
      return await this.undeploymentsRepository.save(createUndeploymentDto.toEntity(deployment, circleId))
    } catch (error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_SAVE_UNDEPLOYMENT', error)
      throw new InternalServerErrorException('Could not save undeployment')
    }
  }

  private async scheduleComponentUndeployments(undeployment: UndeploymentEntity, circle: CircleDeploymentEntity): Promise<void> {
    const componentUndeployments: ComponentUndeploymentEntity[] = undeployment.getComponentUndeployments()
    await Promise.all(
      componentUndeployments.map(
        componentUndeployment => this.enqueueComponentUndeployment(undeployment, componentUndeployment, circle)
      )
    )
  }

  private async enqueueComponentUndeployment(
    undeployment: UndeploymentEntity,
    componentUndeployment: ComponentUndeploymentEntity,
    circle: CircleDeploymentEntity
  ): Promise<void> {

    const queuedUndeployment: QueuedUndeploymentEntity =
      await this.saveQueuedUndeployment(componentUndeployment.componentDeployment, componentUndeployment)

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentUndeployment.componentDeployment.id)

    const component: ComponentEntity = await this.componentsRepository.findOneOrFail(
      { id: componentDeployment.componentId }, { relations: ['module'] }
    )

    if (queuedUndeployment.status === QueuedPipelineStatusEnum.RUNNING) {
      await this.pipelineDeploymentsService.triggerUndeployment(
        componentDeployment, undeployment, component,
        queuedUndeployment, circle
      )
    }
  }

  private async saveQueuedUndeployment(
    componentDeployment: ComponentDeploymentEntity,
    componentUndeployment: ComponentUndeploymentEntity
  ): Promise<QueuedUndeploymentEntity> {

    const status: QueuedPipelineStatusEnum = QueuedPipelineStatusEnum.RUNNING
    try {
      return await this.queuedUndeploymentsRepository.save(
        new QueuedUndeploymentEntity(componentDeployment.componentId, componentDeployment.id, status, componentUndeployment.id)
      )
    } catch (error) {
      return this.handleUniqueRunningConstraint(error as IConstraintError, componentDeployment, componentUndeployment)
    }
  }

  private handleUniqueRunningConstraint(
    error: IConstraintError,
    componentDeployment: ComponentDeploymentEntity,
    componentUndeployment: ComponentUndeploymentEntity
  ): Promise<QueuedUndeploymentEntity> {

    if (error.constraint === QueuedDeploymentsConstraints.UNIQUE_RUNNING_MODULE) {
      return this.queuedUndeploymentsRepository.save(
        new QueuedUndeploymentEntity(
          componentDeployment.componentId, componentDeployment.id, QueuedPipelineStatusEnum.QUEUED, componentUndeployment.id
        )
      )
    }

    this.consoleLoggerService.error('ERROR:COULD_NOT_SAVE_QUEUED_DEPLOYMENT', error)
    throw new InternalServerErrorException('Could not save queued undeployment')
  }

}
