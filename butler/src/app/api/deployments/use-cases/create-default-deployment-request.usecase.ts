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

import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QueuedDeploymentsConstraints } from '../../../core/integrations/databases/constraints'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentEntity } from '../../components/entity'
import { ModuleEntity } from '../../modules/entity'
import {
    CreateDefaultDeploymentRequestDto,
    ReadDeploymentDto
} from '../dto'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    QueuedDeploymentEntity,
    QueuedIstioDeploymentEntity
} from '../entity'
import { QueuedPipelineStatusEnum } from '../enums'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../repository'
import { QueuedIstioDeploymentsRepository } from '../repository/queued-istio-deployments.repository'
import {
    ModulesService,
    PipelineDeploymentsService,
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../services'
import { IConstraintError } from '../interfaces/errors.interface'


@Injectable()
export class CreateDefaultDeploymentRequestUsecase {

    constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>,
        @InjectRepository(ModuleEntity)
        private readonly modulesRepository: Repository<ModuleEntity>,
        @InjectRepository(ComponentEntity)
        private readonly componentsRepository: Repository<ComponentEntity>,
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
        @InjectRepository(QueuedIstioDeploymentsRepository)
        private readonly queuedIstioDeploymentsRepository: QueuedDeploymentsRepository,
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly pipelineQueuesService: PipelineQueuesService,
        private readonly pipelineDeploymentsService: PipelineDeploymentsService,
        private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
        private readonly modulesService: ModulesService
    ) { }

    public async execute(createDefaultDeploymentRequestDto: CreateDefaultDeploymentRequestDto, circleId: string): Promise<ReadDeploymentDto> {
        this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT', createDefaultDeploymentRequestDto)
        const modules: ModuleEntity[] = createDefaultDeploymentRequestDto.modules.map(module => module.toModuleEntity())
        await this.modulesService.createModules(modules)
        const deployment: DeploymentEntity = await this.saveDeploymentEntity(createDefaultDeploymentRequestDto, circleId)
        try {
            await this.scheduleComponentDeployments(deployment)
            this.consoleLoggerService.log('FINISH:CREATE_DEFAULT_DEPLOYMENT', deployment)
            return deployment.toReadDto()
        } catch (error) {
            this.consoleLoggerService.error('ERROR:CREATE_DEFAULT_DEPLOYMENT', error)
            this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
            throw error
        }
    }

    private async saveDeploymentEntity(
        createDefaultDeploymentRequestDto: CreateDefaultDeploymentRequestDto,
        circleId: string
    ): Promise<DeploymentEntity> {

        try {
            return await this.deploymentsRepository.save(createDefaultDeploymentRequestDto.toEntity(circleId))
        } catch (error) {
            this.consoleLoggerService.error('ERROR:COULD_NOT_SAVE_DEPLOYMENT', error)
            throw new InternalServerErrorException('Could not save deployment')
        }
    }

    private async scheduleComponentDeployments(deployment: DeploymentEntity): Promise<void> {
        const componentDeploymentsIds: string[] = deployment.getComponentDeploymentsIds()
        await Promise.all(
            componentDeploymentsIds.map(
                componentDeploymentId => this.enqueueComponentDeployment(deployment, componentDeploymentId)
            )
        )
    }

    private async enqueueComponentDeployment(
        deployment: DeploymentEntity,
        componentDeploymentId: string
    ): Promise<void> {
        const componentDeployment: ComponentDeploymentEntity = await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
        const queuedDeployment: QueuedDeploymentEntity = await this.saveQueuedDeployment(componentDeployment)
        const component: ComponentEntity = await this.componentsRepository.findOneOrFail(
            { id: componentDeployment.componentId }, { relations: ['module'] }
        )
        if (queuedDeployment.status === QueuedPipelineStatusEnum.RUNNING) {
            await this.pipelineDeploymentsService.triggerDefaultDeployment(componentDeployment, component, deployment, queuedDeployment)
        }
        this.scheduleIstioDeployment(deployment, component, componentDeployment)
    }

    private async saveQueuedDeployment(componentDeployment: ComponentDeploymentEntity): Promise<QueuedDeploymentEntity> {
        const status: QueuedPipelineStatusEnum = QueuedPipelineStatusEnum.RUNNING
        try {
            return await this.queuedDeploymentsRepository.save(
                new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, status)
            )
        } catch (error) {
            return this.handleUniqueRunningConstraint(error as IConstraintError, componentDeployment)
        }
    }

    private async scheduleIstioDeployment(
        deployment: DeploymentEntity,
        component: ComponentEntity,
        componentDeployment: ComponentDeploymentEntity,
    ): Promise<void> {
        try {
            await this.saveQueuedIstioDeployment(deployment.id, component.id, componentDeployment.id)
        } catch (error) {
            throw new InternalServerErrorException(error)
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
            throw new InternalServerErrorException(error)
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
