import { Injectable } from '@nestjs/common'
import { QueuedDeploymentStatusEnum } from '../enums'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity } from '../entity'
import { QueuedDeploymentsRepository } from '../repository'
import { PipelineProcessingService } from './pipeline-processing.service'
import { PipelineDeploymentService } from './pipeline-deployment.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class QueuedDeploymentsService {

  constructor(
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    private readonly pipelineProcessingService: PipelineProcessingService,
    private readonly pipelineDeploymentService: PipelineDeploymentService,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>
  ) {}

  public async setQueuedDeploymentStatusFinished(componentDeploymentId: string): Promise<void> {
    await this.queuedDeploymentsRepository.update(
      { componentDeploymentId }, { status: QueuedDeploymentStatusEnum.FINISHED }
    )
  }

  private async getQueuedDeploymentStatus(componentId: string): Promise<QueuedDeploymentStatusEnum> {
    const runningDeployment: QueuedDeploymentEntity =
      await this.queuedDeploymentsRepository.getOneByComponentIdRunning(componentId)

    return runningDeployment ?
      QueuedDeploymentStatusEnum.QUEUED :
      QueuedDeploymentStatusEnum.RUNNING
  }

  private async saveQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    await this.queuedDeploymentsRepository.save(
      new QueuedDeploymentEntity(componentId, componentDeploymentId, status)
    )
  }

  private async createDefaultQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    await this.saveQueuedDeployment(componentId, componentDeploymentId, status)
  }

  private async createRunningQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    await this.pipelineProcessingService.processPipeline(componentDeploymentId)
    await this.pipelineDeploymentService.processDeployment(componentDeploymentId)
    await this.saveQueuedDeployment(componentId, componentDeploymentId, status)
  }

  private async createQueuedDeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    status === QueuedDeploymentStatusEnum.RUNNING ?
      this.createRunningQueuedDeployment(componentId, componentDeploymentId, status) :
      this.createDefaultQueuedDeployment(componentId, componentDeploymentId, status)
  }

  private async queueComponentDeploymentTask(componentDeployment: ComponentDeploymentEntity): Promise<void> {
    const { id: componentDeploymentId, componentId } = componentDeployment
    const status: QueuedDeploymentStatusEnum = await this.getQueuedDeploymentStatus(componentId)
    await this.createQueuedDeployment(componentId, componentDeploymentId, status)
  }

  private async queueModuleDeploymentTasks(moduleDeployment: ModuleDeploymentEntity): Promise<void[]> {
    return Promise.all(
      moduleDeployment.components.map(
        componentDeployment => this.queueComponentDeploymentTask(componentDeployment)
      )
    )
  }

  public async queueDeploymentTasks(deployment: DeploymentEntity): Promise<void[][]> {
    return Promise.all(
      deployment.modules.map(
        moduleDeployment => this.queueModuleDeploymentTasks(moduleDeployment)
      )
    )
  }

  private async deployNextComponent(orderedQueuedDeployments: QueuedDeploymentEntity[]): Promise<void> {
    if (orderedQueuedDeployments.length) {
      const componentDeployment: ComponentDeploymentEntity = await this.componentDeploymentRepository.findOne(
        { id: orderedQueuedDeployments[0].componentDeploymentId }
      )
      await this.createRunningQueuedDeployment(
        componentDeployment.componentId, componentDeployment.id, QueuedDeploymentStatusEnum.RUNNING
      )
    }
  }

  public async triggerNextComponentDeploy(
    finishedComponentDeploymentId: string
  ): Promise<void> {

    const finishedComponentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentRepository.findOne({ id : finishedComponentDeploymentId })
    const { componentId: finishedComponentId } = finishedComponentDeployment
    const queuedDeployments: QueuedDeploymentEntity[] =
      await this.queuedDeploymentsRepository.getAllByComponentIdQueuedAscending(finishedComponentId)
    await this.deployNextComponent(queuedDeployments)
  }
}
