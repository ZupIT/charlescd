import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedDeploymentEntity
} from '../entity'
import { Repository } from 'typeorm'
import {
    CreateDefaultDeploymentRequestDto,
    ReadDeploymentDto
} from '../dto'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { QueuedPipelineStatusEnum } from '../enums'
import { ModuleEntity } from '../../modules/entity'
import { ComponentEntity } from '../../components/entity'
import {
    PipelineDeploymentsService,
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../services'
import { QueuedDeploymentsRepository } from '../repository'

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
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly pipelineQueuesService: PipelineQueuesService,
        private readonly pipelineDeploymentsService: PipelineDeploymentsService,
        private readonly pipelineErrorHandlerService: PipelineErrorHandlerService
    ) { }

    public async execute(createDefaultDeploymentRequestDto: CreateDefaultDeploymentRequestDto, circleId: string): Promise<ReadDeploymentDto> {
        let deployment: DeploymentEntity

        try {
            this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT', createDefaultDeploymentRequestDto)
            deployment = await this.saveDeploymentEntity(createDefaultDeploymentRequestDto, circleId)
            await this.saveModulesAndComponentEntities(deployment)
            await this.scheduleComponentDeployments(deployment)
            this.consoleLoggerService.log('START:CREATE_DEFAULT_DEPLOYMENT', deployment)
            return deployment.toReadDto()
        } catch (error) {
            this.consoleLoggerService.error('ERROR:CREATE_DEFAULT_DEPLOYMENT')
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
            throw new InternalServerErrorException('Could not save deployment')
        }
    }

    private async saveModulesAndComponentEntities(deployment: DeploymentEntity): Promise<void> {
        try {
            await Promise.all(
                deployment.modules
                    .map(moduleDeployment => this.saveModuleEntities(moduleDeployment))
            )
        } catch (error) {
            throw new InternalServerErrorException('Could not save modules')
        }
    }

    private async saveModuleEntities(moduleDeployment: ModuleDeploymentEntity): Promise<void> {
        let moduleEntity: ModuleEntity

        moduleEntity = await this.modulesRepository.findOne({ id: moduleDeployment.moduleId })
        if (!moduleEntity) {
            moduleEntity = await this.modulesRepository.save(
                new ModuleEntity(moduleDeployment.moduleId, [])
            )
        }
        await this.saveComponentsEntities(moduleDeployment, moduleEntity)
    }

    private async saveComponentsEntities(moduleDeployment: ModuleDeploymentEntity, moduleEntity: ModuleEntity): Promise<void> {
        try {
            await Promise.all(
                moduleDeployment.components
                    .map(componentDeployment => this.saveComponentEntity(componentDeployment, moduleEntity))
            )
        } catch (error) {
            throw new InternalServerErrorException('Could not save components')
        }
    }

    private async saveComponentEntity(componentDeployment: ComponentDeploymentEntity, module: ModuleEntity): Promise<ComponentEntity> {
        const componentEntity: ComponentEntity =
            await this.componentsRepository.findOne({ id: componentDeployment.componentId })

        if (!componentEntity) {
            return await this.componentsRepository.save(
                new ComponentEntity(componentDeployment.componentId, module)
            )
        }
    }

    private async scheduleComponentDeployments(deployment: DeploymentEntity): Promise<void> {
        try {
            const componentDeployments: ComponentDeploymentEntity[] = deployment.getComponentDeployments()
            await Promise.all(
                componentDeployments.map(
                    componentDeployment => this.enqueueComponentDeployment(deployment, componentDeployment)
                )
            )
        } catch (error) {
            throw error
        }
    }

    private async enqueueComponentDeployment(
        deployment: DeploymentEntity,
        componentDeployment: ComponentDeploymentEntity
    ): Promise<void> {

        let queuedDeployment: QueuedDeploymentEntity

        try {
            queuedDeployment = await this.saveQueuedDeployment(componentDeployment)
            const component: ComponentEntity = await this.componentsRepository.findOne({ id: componentDeployment.componentId })
            if (queuedDeployment.status === QueuedPipelineStatusEnum.RUNNING) {
                await this.pipelineDeploymentsService.triggerDefaultDeployment(componentDeployment, component, deployment, queuedDeployment)
            }
        } catch (error) {
            throw error
        }
    }

    private async saveQueuedDeployment(componentDeployment: ComponentDeploymentEntity): Promise<QueuedDeploymentEntity> {
        const status: QueuedPipelineStatusEnum = QueuedPipelineStatusEnum.RUNNING
        try {
            return await this.queuedDeploymentsRepository.save(
                new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, status)
            )
        } catch (error) {
            return this.handleUniqueRunningConstraint(error, componentDeployment)
        }
    }

    private handleUniqueRunningConstraint(
        error: any,
        componentDeployment: ComponentDeploymentEntity,
    ): Promise<QueuedDeploymentEntity> {

        if (error.constraint === 'queued_deployments_status_running_uniq') {
            return this.queuedDeploymentsRepository.save(
                new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, QueuedPipelineStatusEnum.QUEUED)
            )
        }
        throw new InternalServerErrorException('Could not save queued deployment')

    }
}
