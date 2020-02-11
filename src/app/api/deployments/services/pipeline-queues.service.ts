import {
  Inject,
  Injectable
} from '@nestjs/common'
import {
  QueuedPipelineStatusEnum,
  QueuedPipelineTypesEnum
} from '../enums'
import {
  ComponentDeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity
} from '../entity'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { StatusManagementService } from '../../../core/services/deployments'
import { MooveService } from '../../../core/integrations/moove'
import { ComponentEntity } from '../../components/entity'
import { PipelineDeploymentsService } from './'
import { AppConstants } from '../../../core/constants'
import { IConsulKV } from '../../../core/integrations/consul/interfaces'

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
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly consulConfiguration: IConsulKV,
    private readonly statusManagementService: StatusManagementService,
    private readonly mooveService: MooveService,
    private readonly pipelineDeploymentsService: PipelineDeploymentsService
  ) {}

  public async triggerNextComponentPipeline(finishedComponentDeployment: ComponentDeploymentEntity): Promise<void> {
    try {
      const nextQueuedDeployment: QueuedDeploymentEntity =
          await this.queuedDeploymentsRepository.getNextQueuedDeployment(finishedComponentDeployment.componentId)

      if (nextQueuedDeployment) {
        nextQueuedDeployment.type === QueuedPipelineTypesEnum.QueuedDeploymentEntity ?
            await this.triggerQueuedDeployment(nextQueuedDeployment) :
            await this.triggerQueuedUndeployment(nextQueuedDeployment as QueuedUndeploymentEntity)
      }
    } catch (error) {
      throw error
    }
  }

  private async triggerQueuedDeployment(queuedDeployment: QueuedDeploymentEntity): Promise<void> {

    let componentDeployment: ComponentDeploymentEntity
    let component: ComponentEntity

    try {
      componentDeployment = await this.componentDeploymentsRepository.getOneWithRelations(queuedDeployment.componentDeploymentId)
      component = await this.componentsRepository.findOne({ id: componentDeployment.componentId })
      const { moduleDeployment: { deployment } } = componentDeployment

      deployment.defaultCircle ?
        await this.pipelineDeploymentsService.triggerDefaultDeployment(componentDeployment, component, deployment, queuedDeployment) :
        await this.pipelineDeploymentsService.triggerCircleDeployment(componentDeployment, component, deployment, queuedDeployment)
    } catch (error) {
      throw error
    }
  }

  private async triggerQueuedUndeployment(queuedUndeployment: QueuedUndeploymentEntity): Promise<void> {

    let componentDeployment: ComponentDeploymentEntity
    let component: ComponentEntity

    try {
      componentDeployment = await this.componentDeploymentsRepository.getOneWithRelations(queuedUndeployment.componentDeploymentId)
      component = await this.componentsRepository.findOne({ id: componentDeployment.componentId })
      const { moduleDeployment: { deployment } } = componentDeployment

      await this.pipelineDeploymentsService.triggerUndeployment(componentDeployment, component, deployment, queuedUndeployment)
    } catch (error) {
      throw error
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
    const runningDeployment: QueuedDeploymentEntity =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(componentId)

    return runningDeployment ?
      QueuedPipelineStatusEnum.QUEUED :
      QueuedPipelineStatusEnum.RUNNING
  }
}
