import { Injectable } from '@nestjs/common'
import { CreateUndeploymentDto } from '../dto/create-undeployment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, UndeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { QueuedDeploymentStatusEnum } from '../enums'
import { QueuedDeploymentsRepository } from '../repository'
import { PipelineQueuesService, PipelinesService } from '../services'

@Injectable()
export class CreateUndeploymentRequestUsecase {

  constructor(
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(UndeploymentEntity)
    private readonly undeploymentsRepository: Repository<UndeploymentEntity>,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    private readonly queuedDeploymentsService: PipelineQueuesService,
    private readonly pipelinesService: PipelinesService
  ) {}

  public async execute(
    createUndeploymentDto: CreateUndeploymentDto,
    deploymentId: string
  ): Promise<ReadUndeploymentDto> {

    try {
      const undeployment: UndeploymentEntity =
        await this.persistUndeploymentRequest(createUndeploymentDto, deploymentId)
      await this.scheduleUndeploymentComponents(undeployment.deployment)
    } catch (error) {
      return Promise.reject({})
    }
  }

  private async persistUndeploymentRequest(
    createUndeploymentDto: CreateUndeploymentDto,
    deploymentId: string
  ): Promise<UndeploymentEntity> {

    try {
      const deployment: DeploymentEntity =
        await this.deploymentsRepository.findOne({ id: deploymentId })
      return await this.undeploymentsRepository.save(createUndeploymentDto.toEntity(deployment))
    } catch (error) {
      return Promise.reject({})
    }
  }

  private async scheduleUndeploymentComponents(deployment: DeploymentEntity): Promise<void> {

    try {
      const componentDeployments: ComponentDeploymentEntity[] = deployment.getComponentDeployments()
      await Promise.all(
        componentDeployments.map(
          componentDeployment => this.scheduleComponent(componentDeployment)
        )
      )
    } catch (error) {
      return Promise.reject({})
    }
  }

  private async scheduleComponent(componentDeployment: ComponentDeploymentEntity): Promise<void> {

    try {
      const { id: componentDeploymentId, componentId } = componentDeployment
      const status: QueuedDeploymentStatusEnum =
        await this.queuedDeploymentsService.getQueuedDeploymentStatus(componentId)
      await this.createUndeployment(componentId, componentDeploymentId, status)
    } catch (error) {
      return Promise.reject({})
    }
  }

  private async createUndeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ): Promise<void> {

    // TODO passar o type = UNDEPLOYMENT
    await this.queuedDeploymentsService.saveQueuedDeployment(componentId, componentDeploymentId, status)
    if (status === QueuedDeploymentStatusEnum.RUNNING) {
      await this.pipelinesService.triggerUndeployment(componentDeploymentId)
    }
  }
}
