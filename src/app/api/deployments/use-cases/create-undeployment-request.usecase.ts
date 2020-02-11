import {
  Inject,
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
import {
  QueuedPipelineStatusEnum,
  UndeploymentStatusEnum
} from '../enums'
import {
  PipelineDeploymentsService,
  PipelineQueuesService
} from '../services'
import { NotificationStatusEnum } from '../../notifications/enums'
import { StatusManagementService } from '../../../core/services/deployments'
import { MooveService } from '../../../core/integrations/moove'
import { ComponentEntity } from '../../components/entity'
import { AppConstants } from '../../../core/constants'
import { IConsulKV } from '../../../core/integrations/consul/interfaces'

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
    private readonly statusManagementService: StatusManagementService,
    private readonly mooveService: MooveService,
    private readonly pipelineDeploymentsService: PipelineDeploymentsService,
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly consulConfiguration: IConsulKV
  ) {}

  public async execute(createUndeploymentDto: CreateUndeploymentDto, deploymentId: string): Promise<ReadUndeploymentDto> {
    let undeployment: UndeploymentEntity

    try {
      undeployment = await this.persistUndeploymentRequest(createUndeploymentDto, deploymentId)
      await this.scheduleComponentUndeployments(undeployment)
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
      queuedUndeployment = await this.persistQueuedUndeployment(componentUndeployment.componentDeployment, componentUndeployment)
      const component: ComponentEntity =
          await this.componentsRepository.findOne({ id: componentUndeployment.componentDeployment.componentId })

      if (queuedUndeployment.status === QueuedPipelineStatusEnum.RUNNING) {
        await this.triggerComponentUndeployment(
            component, componentUndeployment.componentDeployment,
            undeployment.deployment, queuedUndeployment
        )
      }
    } catch (error) {
      if (queuedUndeployment && queuedUndeployment.status === QueuedPipelineStatusEnum.RUNNING) {
        await this.pipelineQueuesService.setQueuedUndeploymentStatusFinished(queuedUndeployment.id)
        this.pipelineQueuesService.triggerNextComponentPipeline(componentUndeployment.componentDeployment)
      }
      throw error
    }
  }

  private async persistQueuedUndeployment(
      componentDeployment: ComponentDeploymentEntity,
      componentUndeployment: ComponentUndeploymentEntity
  ): Promise<QueuedUndeploymentEntity> {

    try {
      const status: QueuedPipelineStatusEnum =
          await this.pipelineQueuesService.getQueuedPipelineStatus(componentDeployment.componentId)

      return await this.queuedUndeploymentsRepository.save(
          new QueuedUndeploymentEntity(componentDeployment.componentId, componentDeployment.id, status, componentUndeployment.id)
      )
    } catch (error) {
      throw new InternalServerErrorException('Could not save queued undeployment')
    }
  }

  private async triggerComponentUndeployment(
      component: ComponentEntity,
      componentDeployment: ComponentDeploymentEntity,
      deployment: DeploymentEntity,
      queuedUndeployment: QueuedUndeploymentEntity
  ): Promise<void> {

    await this.unsetComponentPipelineCircle(component, deployment)
    const pipelineCallbackUrl: string = this.getUndeploymentCallbackUrl(queuedUndeployment.id)
    await this.pipelineDeploymentsService.triggerComponentDeployment(
        component, deployment, componentDeployment,
        pipelineCallbackUrl, queuedUndeployment.id
    )
  }

  private async unsetComponentPipelineCircle(
      component: ComponentEntity,
      deployment: DeploymentEntity
  ): Promise<ComponentEntity> {

    try {
      component.unsetPipelineCircle(deployment.circle)
      return await this.componentsRepository.save(component)
    } catch (error) {
      throw new InternalServerErrorException('Could not update component pipeline')
    }
  }

  private getUndeploymentCallbackUrl(queuedUndeploymentId: number): string {
    return `${this.consulConfiguration.darwinUndeploymentCallbackUrl}?queuedUndeploymentId=${queuedUndeploymentId}`
  }
}
