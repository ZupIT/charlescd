import {Injectable} from '@nestjs/common'
import {CreateUndeploymentDto} from '../dto/create-undeployment.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {ComponentDeploymentEntity, ComponentUndeploymentEntity, DeploymentEntity, UndeploymentEntity} from '../entity'
import {Repository} from 'typeorm'
import {QueuedPipelineStatusEnum} from '../enums'
import {QueuedDeploymentsRepository} from '../repository'
import {PipelineQueuesService, PipelinesService} from '../services'
import {ReadUndeploymentDto} from '../dto'

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
      await this.scheduleUndeploymentComponents(undeployment)
      return undeployment.toReadDto()
    } catch (error) {
      return Promise.reject({ error })
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
      return Promise.reject({ error })
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
      return Promise.reject({ error })
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
      return Promise.reject({ error })
    }
  }

  private async createUndeployment(
      componentUndeployment: ComponentUndeploymentEntity,
      status: QueuedPipelineStatusEnum
  ): Promise<void> {

    try {
      const { componentId, id: componentDeploymentId } = componentUndeployment.componentDeployment
      const { id: componentUndeploymentId } = componentUndeployment
      const { id: queuedUndeploymentId } = await this.pipelineQueuesService.enqueueUndeploymentExecution(
          componentId, componentDeploymentId, status, componentUndeploymentId
      )
      if (status === QueuedPipelineStatusEnum.RUNNING) {
        await this.pipelinesService.triggerUndeployment(componentDeploymentId, queuedUndeploymentId)
      }
    } catch (error) {
      return Promise.reject({ error })
    }
  }
}
