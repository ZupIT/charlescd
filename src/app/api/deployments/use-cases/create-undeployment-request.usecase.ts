import { Injectable } from '@nestjs/common'
import { CreateUndeploymentDto } from '../dto/create-undeployment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, UndeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../enums'
import { QueuedDeploymentsRepository } from '../repository'
import { PipelineQueuesService, PipelinesService } from '../services'
import { ReadUndeploymentDto } from '../dto'

@Injectable()
export class CreateUndeploymentRequestUsecase {

  constructor(
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(UndeploymentEntity)
    private readonly undeploymentsRepository: Repository<UndeploymentEntity>,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    private readonly pipelineQueuesService: PipelineQueuesService,
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
      return undeployment.toReadDto()
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

  private async scheduleUndeploymentComponents(
      deployment: DeploymentEntity
  ): Promise<void> {

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

  private async scheduleComponent(
      componentDeployment: ComponentDeploymentEntity
  ): Promise<void> {

    try {
      const { id: componentDeploymentId, componentId } = componentDeployment
      const status: QueuedPipelineStatusEnum =
        await this.pipelineQueuesService.getQueuedPipelineStatus(componentId)
      await this.createUndeployment(componentId, componentDeploymentId, status)
    } catch (error) {
      return Promise.reject({})
    }
  }

  private async createUndeployment(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ): Promise<void> {

    try {
      await this.pipelineQueuesService.enqueuePipelineExecution(
        componentId, componentDeploymentId, status, QueuedPipelineTypesEnum.UNDEPLOYMENT
      )
      if (status === QueuedPipelineStatusEnum.RUNNING) {
        await this.pipelinesService.triggerUndeployment(componentDeploymentId)
      }
    } catch (error) {
      return Promise.reject({})
    }
  }
}
