import { Injectable } from '@nestjs/common'
import { QueuedDeploymentStatusEnum } from '../enums'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity
} from '../entity'
import { QueuedDeploymentsRepository } from '../repository'
import { PipelineProcessingService } from './pipeline-processing.service'

@Injectable()
export class QueuedDeploymentsService {

  constructor(
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    private readonly pipelineProcessingService: PipelineProcessingService
  ) {}

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

    // TRIGGER DEPLOY
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
}
