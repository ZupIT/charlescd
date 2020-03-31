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
    QueuedDeploymentEntity
} from '../entity'
import { QueuedPipelineStatusEnum } from '../enums'
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../repository'
import {
    PipelineDeploymentsService,
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../services'

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
            throw new InternalServerErrorException('Could not save deployment')
        }
    }

    private async scheduleComponentDeployments(deployment: DeploymentEntity): Promise<void> {
        try {
            const componentDeploymentsIds: string[] = deployment.getComponentDeploymentsIds()
            await Promise.all(
                componentDeploymentsIds.map(
                    componentDeploymentId => this.enqueueComponentDeployment(deployment, componentDeploymentId)
                )
            )
        } catch (error) {
            throw error
        }
    }

    private async enqueueComponentDeployment(
        deployment: DeploymentEntity,
        componentDeploymentId: string
    ): Promise<void> {

        try {
            const componentDeployment: ComponentDeploymentEntity =
                await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
            const queuedDeployment: QueuedDeploymentEntity = await this.saveQueuedDeployment(componentDeployment)
            const component: ComponentEntity =
                await this.componentsRepository.findOne({ id: componentDeployment.componentId }, { relations: ['module'] })

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

        if (error.constraint === QueuedDeploymentsConstraints.UNIQUE_RUNNING_MODULE) {
            return this.queuedDeploymentsRepository.save(
                new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, QueuedPipelineStatusEnum.QUEUED)
            )
        }
        throw new InternalServerErrorException('Could not save queued deployment')
    }
}
