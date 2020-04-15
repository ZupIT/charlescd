import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    QueuedDeploymentEntity
} from '../entity'
import { Repository } from 'typeorm'
import {
    CreateCircleDeploymentRequestDto,
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
import {
    ComponentDeploymentsRepository,
    QueuedDeploymentsRepository
} from '../repository'
import { QueuedDeploymentsConstraints } from '../../../core/integrations/databases/constraints'

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
        @InjectRepository(ComponentDeploymentsRepository)
        private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly pipelineQueuesService: PipelineQueuesService,
        private readonly pipelineDeploymentsService: PipelineDeploymentsService,
        private readonly pipelineErrorHandlerService: PipelineErrorHandlerService
    ) { }

    public async execute(createCircleDeploymentRequestDto: CreateCircleDeploymentRequestDto, circleId: string): Promise<ReadDeploymentDto> {
        this.consoleLoggerService.log('START:CREATE_CIRCLE_DEPLOYMENT', createCircleDeploymentRequestDto)
        const deployment: DeploymentEntity = await this.saveDeploymentEntity(createCircleDeploymentRequestDto, circleId)
        try {
            await this.scheduleComponentDeployments(deployment)
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
            const componentDeployment: ComponentDeploymentEntity | undefined =
                await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
            if (!componentDeployment) {
                throw new NotFoundException(`ComponentDeploymentEntity not found - id: ${componentDeploymentId}`)
            }
            const queuedDeployment: QueuedDeploymentEntity | undefined = await this.saveQueuedDeployment(componentDeployment)
            const component: ComponentEntity | undefined =
                await this.componentsRepository.findOne({ id: componentDeployment.componentId }, { relations: ['module'] })

            if (queuedDeployment.status === QueuedPipelineStatusEnum.RUNNING && component) {
                await this.pipelineDeploymentsService.triggerCircleDeployment(componentDeployment, component, deployment, queuedDeployment)
            }
        } catch (error) {
            throw error
        }
    }

    private async saveQueuedDeployment(componentDeployment: ComponentDeploymentEntity): Promise<QueuedDeploymentEntity> {
        try {
            return await this.queuedDeploymentsRepository.save(
                new QueuedDeploymentEntity(componentDeployment.componentId, componentDeployment.id, QueuedPipelineStatusEnum.RUNNING)
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
