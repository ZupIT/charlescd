import { Injectable } from '@nestjs/common'
import { CreateUndeploymentDto } from '../dto/create-undeployment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ComponentUndeploymentEntity,
  DeploymentEntity,
  QueuedUndeploymentEntity,
  UndeploymentEntity
} from '../entity'
import { Repository } from 'typeorm'
import {
  QueuedPipelineStatusEnum,
  UndeploymentStatusEnum
} from '../enums'
import { QueuedDeploymentsRepository } from '../repository'
import {
  PipelineQueuesService,
  PipelinesService
} from '../services'
import { ReadUndeploymentDto } from '../dto'
import { NotificationStatusEnum } from '../../notifications/enums'
import { StatusManagementService } from '../../../core/services/deployments'
import { MooveService } from '../../../core/integrations/moove'

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
    private readonly pipelinesService: PipelinesService,
    private readonly statusManagementService: StatusManagementService,
    private readonly mooveService: MooveService
  ) {}

  public async execute(createUndeploymentDto: CreateUndeploymentDto, deploymentId: string): Promise<ReadUndeploymentDto> {
    let undeployment: UndeploymentEntity

    try {
      undeployment = await this.persistUndeploymentRequest(createUndeploymentDto, deploymentId)
      await this.scheduleUndeploymentComponents(undeployment)
      return undeployment.toReadDto()
    } catch (error) {
      if (undeployment && !undeployment.hasFailed()) {
        await this.statusManagementService.deepUpdateUndeploymentStatus(undeployment, UndeploymentStatusEnum.FAILED)
        await this.mooveService.notifyDeploymentStatus(
            undeployment.deployment.id, NotificationStatusEnum.UNDEPLOY_FAILED,
            undeployment.deployment.callbackUrl, undeployment.deployment.circleId
        )
      }
      throw error
    }
  }

  private async persistUndeploymentRequest(
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
      throw error
    }
  }

  private async scheduleUndeploymentComponents(undeployment: UndeploymentEntity): Promise<void> {

    try {
      const componentUndeployments: ComponentUndeploymentEntity[] = undeployment.getComponentUndeployments()
      await Promise.all(
          componentUndeployments.map(
              componentUndeployment => this.scheduleComponent(componentUndeployment)
          )
      )
    } catch (error) {
      throw error
    }
  }

  private async scheduleComponent(
      componentUndeployment: ComponentUndeploymentEntity
  ): Promise<void> {

    try {
      const { componentId } = componentUndeployment.componentDeployment
      const status: QueuedPipelineStatusEnum =
          await this.pipelineQueuesService.getQueuedPipelineStatus(componentId)
      await this.createUndeployment(componentUndeployment, status)
    } catch (error) {
      throw error
    }
  }

  private async createUndeployment(
      componentUndeployment: ComponentUndeploymentEntity,
      status: QueuedPipelineStatusEnum
  ): Promise<void> {

    let queuedUndeployment: QueuedUndeploymentEntity

    try {
      const { componentId, id: componentDeploymentId } = componentUndeployment.componentDeployment
      const { id: componentUndeploymentId } = componentUndeployment
      queuedUndeployment = await this.pipelineQueuesService.enqueueUndeploymentExecution(
          componentId, componentDeploymentId, status, componentUndeploymentId
      )
      if (status === QueuedPipelineStatusEnum.RUNNING) {
        await this.pipelinesService.triggerUndeployment(componentDeploymentId, queuedUndeployment.id)
      }
    } catch (error) {
      if (status === QueuedPipelineStatusEnum.RUNNING) {
        await this.pipelineQueuesService.setQueuedUndeploymentStatusFinished(queuedUndeployment.id)
        this.pipelineQueuesService.triggerNextComponentPipeline(queuedUndeployment.componentDeploymentId)
      }
      throw error
    }
  }
}
