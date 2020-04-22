import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentEntity } from '../../components/entity'
import { ComponentDeploymentEntity, QueuedDeploymentEntity, QueuedUndeploymentEntity, UndeploymentEntity } from '../entity'
import { QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../enums'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../repository'
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
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    @Inject(forwardRef(() => PipelineDeploymentsService))
    private readonly pipelineDeploymentsService: PipelineDeploymentsService,
    @InjectRepository(UndeploymentEntity)
    private readonly undeploymentsRepository: Repository<UndeploymentEntity>,

  ) { }

  public async triggerNextComponentPipeline(finishedComponentDeployment: ComponentDeploymentEntity): Promise<void> {
    try {
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
    } catch (error) {
      throw error
    }
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

    const { moduleDeployment: { deployment } } = componentDeployment
    const undeployment = await this.undeploymentsRepository.findOneOrFail({ where: { deployment_id: deployment.id } })
    await this.pipelineDeploymentsService.triggerUndeployment(componentDeployment, undeployment, component, queuedUndeployment, deployment.circle)
  }

  private async setQueuedDeploymentStatus(queuedDeployment: QueuedDeploymentEntity, status: QueuedPipelineStatusEnum): Promise<void> {
    try {
      await this.queuedDeploymentsRepository.update(
        { id: queuedDeployment.id }, { status }
      )
    } catch (error) {
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
