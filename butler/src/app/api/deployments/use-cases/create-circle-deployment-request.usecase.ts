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
import { ModuleEntity } from '../../modules/entity'
import { CreateCircleDeploymentRequestDto, ReadDeploymentDto } from '../dto'
import { CircleDeploymentEntity, ComponentDeploymentEntity, DeploymentEntity, QueuedDeploymentEntity, QueuedIstioDeploymentEntity } from '../entity'
import { QueuedPipelineStatusEnum } from '../enums'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../repository'
import { PipelineDeploymentsService, PipelineErrorHandlerService, ModulesService } from '../services'
import { IConstraintError } from '../interfaces/errors.interface'
import { QueuedIstioDeploymentsRepository } from '../repository/queued-istio-deployments.repository'

@Injectable()
export class CreateCircleDeploymentRequestUsecase {

  constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>,
        @InjectRepository(ModuleEntity)
        private readonly modulesRepository: Repository<ModuleEntity>,
        @InjectRepository(ComponentEntity)
        private readonly componentsRepository: Repository<ComponentEntity>,
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(QueuedIstioDeploymentsRepository)
        private readonly queuedIstioDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly pipelineDeploymentsService: PipelineDeploymentsService,
        private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
        private readonly modulesService: ModulesService
  ) { }

  public async execute(createCircleDeploymentRequestDto: CreateCircleDeploymentRequestDto, circleId: string): Promise<ReadDeploymentDto> {
    this.consoleLoggerService.log('START:CREATE_CIRCLE_DEPLOYMENT', createCircleDeploymentRequestDto)
    const modules: ModuleEntity[] = createCircleDeploymentRequestDto.modules.map(module => module.toModuleEntity())
    await this.modulesService.createModules(modules)
    const deployment: DeploymentEntity = await this.saveDeploymentEntity(createCircleDeploymentRequestDto, circleId)
    if (!deployment.circle) {
      this.consoleLoggerService.error('ERROR:DEPLOYMENT_DOES_NOT_HAVE_CIRCLE', deployment)
      throw new BadRequestException('Deployment does not have a circle')
    }
    try {
      await this.scheduleComponentDeployments(deployment, deployment.circle)
      this.consoleLoggerService.log('FINISH:CREATE_CIRCLE_DEPLOYMENT', deployment)
      return deployment.toReadDto()
    } catch (error) {
      this.consoleLoggerService.error('ERROR:CREATE_CIRCLE_DEPLOYMENT', error)
      await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
      throw error
    }
  }

  private async saveDeploymentEntity(
    createCircleDeploymentRequestDto: CreateCircleDeploymentRequestDto,
    circleId: string
  ): Promise<DeploymentEntity> {

    try {
      return await this.deploymentsRepository.save(createCircleDeploymentRequestDto.toEntity(circleId))
    } catch (error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_SAVE_DEPLOYMENT', error)
      throw new InternalServerErrorException('Could not save deployment')
    }
  }

  private async scheduleComponentDeployments(deployment: DeploymentEntity, circle: CircleDeploymentEntity): Promise<void> {
    const componentDeploymentsIds: string[] = deployment.getComponentDeploymentsIds()
    await Promise.all(
      componentDeploymentsIds.map(
        componentDeploymentId => this.enqueueComponentDeployment(deployment, componentDeploymentId, circle)
      )
    )
  }

  private async enqueueComponentDeployment(
    deployment: DeploymentEntity,
    componentDeploymentId: string,
    circle: CircleDeploymentEntity
  ): Promise<void> {
    const componentDeployment = await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const queuedDeployment: QueuedDeploymentEntity = await this.saveQueuedDeployment(componentDeployment)
    const component: ComponentEntity = await this.componentsRepository.findOneOrFail(
      { id: componentDeployment.componentId }, { relations: ['module'] }
    )
    if (queuedDeployment.status === QueuedPipelineStatusEnum.RUNNING) {
      await this.pipelineDeploymentsService.triggerCircleDeployment(componentDeployment, component, deployment, queuedDeployment, circle)
    }
    this.scheduleIstioDeployment(deployment, component, componentDeployment)
  }

  private async scheduleIstioDeployment(
    deployment: DeploymentEntity,
    component: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
  ): Promise<void> {
    try {
      await this.saveQueuedIstioDeployment(deployment.id, component.id, componentDeployment.id)
    } catch (error) {
      throw new InternalServerErrorException('Cold not save istio deployment')
    }
  }

  private async saveQueuedIstioDeployment(
    deploymentId: string,
    componentId: string,
    componentDeploymentId: string,
  ): Promise<QueuedIstioDeploymentEntity> {
    try {
      return await this.queuedIstioDeploymentsRepository.save(
        new QueuedIstioDeploymentEntity(deploymentId, componentId, componentDeploymentId, QueuedPipelineStatusEnum.QUEUED)
      )
    } catch (error) {
      throw new InternalServerErrorException('Could not save queued deployment')
    }
  }

  private async saveQueuedDeployment(componentDeployment: ComponentDeploymentEntity): Promise<QueuedDeploymentEntity> {
    try {
      return await this.queuedDeploymentsRepository.save(
        new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, QueuedPipelineStatusEnum.RUNNING)
      )
    } catch (error) {
      return this.handleUniqueRunningConstraint(error as IConstraintError, componentDeployment)
    }
  }

  private handleUniqueRunningConstraint(
    error: IConstraintError,
    componentDeployment: ComponentDeploymentEntity,
  ): Promise<QueuedDeploymentEntity> {
    if (error.constraint === QueuedDeploymentsConstraints.UNIQUE_RUNNING_MODULE) {
      return this.queuedDeploymentsRepository.save(
        new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, QueuedPipelineStatusEnum.QUEUED)
      )
    }
    this.consoleLoggerService.error('ERROR:COULD_NOT_SAVE_QUEUED_DEPLOYMENT', error)
    throw new InternalServerErrorException('Could not save queued deployment')
  }
}
