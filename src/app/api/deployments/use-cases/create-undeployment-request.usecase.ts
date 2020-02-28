import {
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import {
  CreateUndeploymentDto,
  ReadUndeploymentDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  QueuedUndeploymentEntity,
  UndeploymentEntity
} from '../entity'
import { Repository } from 'typeorm'
import { QueuedPipelineStatusEnum } from '../enums'
import {
  PipelineDeploymentsService,
  PipelineErrorHandlerService,
  PipelineQueuesService
} from '../services'
import { ComponentEntity } from '../../components/entity'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { QueuedDeploymentsConstraints } from '../../../core/database_constraints/queued_deployments.constraints'

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
    private readonly pipelineQueuesService: PipelineQueuesService,
    private readonly pipelineDeploymentsService: PipelineDeploymentsService,
    private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async execute(createUndeploymentDto: CreateUndeploymentDto, deploymentId: string): Promise<ReadUndeploymentDto> {
    let undeployment: UndeploymentEntity

    try {
      this.consoleLoggerService.log('START:CREATE_UNDEPLOYMENT', createUndeploymentDto)
      undeployment = await this.saveUndeploymentRequest(createUndeploymentDto, deploymentId)
      await this.scheduleComponentUndeployments(undeployment)
      this.consoleLoggerService.log('START:CREATE_UNDEPLOYMENT', undeployment)
      return undeployment.toReadDto()
    } catch (error) {
      this.consoleLoggerService.log('ERROR:CREATE_UNDEPLOYMENT')
      this.pipelineErrorHandlerService.handleUndeploymentFailure(undeployment)
      throw error
    }
  }

  private async saveUndeploymentRequest(
    createUndeploymentDto: CreateUndeploymentDto,
    deploymentId: string
  ): Promise<UndeploymentEntity> {

    try {
      const deployment: DeploymentEntity = await this.deploymentsRepository.findOne({
        where: { id: deploymentId },
        relations: ['modules', 'modules.components']
      })
      return await this.undeploymentsRepository.save(createUndeploymentDto.toEntity(deployment))
    } catch (error) {
      throw new InternalServerErrorException('Could not save undeployment')
    }
  }

  private async scheduleComponentUndeployments(undeployment: UndeploymentEntity): Promise<void> {
    try {
      const componentUndeployments: ComponentUndeploymentEntity[] = undeployment.getComponentUndeployments()
      await Promise.all(
        componentUndeployments.map(
          componentUndeployment => this.enqueueComponentUndeployment(undeployment, componentUndeployment)
        )
      )
    } catch (error) {
      throw error
    }
  }

  private async enqueueComponentUndeployment(
    undeployment: UndeploymentEntity,
    componentUndeployment: ComponentUndeploymentEntity
  ): Promise<void> {

    let queuedUndeployment: QueuedUndeploymentEntity

    try {
      queuedUndeployment = await this.saveQueuedUndeployment(componentUndeployment.componentDeployment, componentUndeployment)
      const component: ComponentEntity = await this.componentsRepository.findOne(
          { id: componentUndeployment.componentDeployment.componentId }, { relations: ['module'] }
      )

      if (queuedUndeployment.status === QueuedPipelineStatusEnum.RUNNING) {
        await this.pipelineDeploymentsService.triggerUndeployment(
          componentUndeployment.componentDeployment, component,
          undeployment.deployment, queuedUndeployment
        )
      }
    } catch (error) {
      throw error
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
      return this.handleUniqueRunningConstraint(error, componentDeployment, componentUndeployment)
    }
  }

  private handleUniqueRunningConstraint(
    error: any,
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

    throw new InternalServerErrorException('Could not save queued undeployment')
  }

}
