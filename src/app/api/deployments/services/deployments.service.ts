import {
  BadRequestException,
  Injectable
} from '@nestjs/common'
import {
  CreateDeploymentDto,
  ReadDeploymentDto
} from '../dto'
import { DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { PipelineQueuesService } from './pipeline-queues.service'
import { NotificationStatusEnum } from '../../notifications/enums'
import { DeploymentStatusEnum } from '../enums'
import { DeploymentsStatusManagementService } from '../../../../../dist/app/core/services/deployments-status-management-service'
import { MooveService } from '../../../core/integrations/moove'
import { StatusManagementService } from '../../../core/services/deployments'

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    private readonly statusManagementService: StatusManagementService,
    private readonly mooveService: MooveService
  ) {}

  public async createDeployment(createDeploymentDto: CreateDeploymentDto, circleId: string): Promise<ReadDeploymentDto> {
    let deployment: DeploymentEntity

    try {
      this.consoleLoggerService.log(`START:CREATE_DEPLOYMENT`, createDeploymentDto)
      await this.verifyIfDeploymentExists(createDeploymentDto.deploymentId)
      deployment = await this.deploymentsRepository.save(createDeploymentDto.toEntity(circleId))
      await this.pipelineQueuesService.queueDeploymentTasks(deployment)
      const deploymentReadDto: ReadDeploymentDto = deployment.toReadDto()
      this.consoleLoggerService.log(`FINISH:CREATE_DEPLOYMENT`, deploymentReadDto)
      return deploymentReadDto
    } catch (error) {
      if (deployment) {
        await this.statusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
        await this.mooveService.notifyDeploymentStatus(deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId)
      }
      throw error
    }
  }

  private async verifyIfDeploymentExists(deploymentId: string): Promise<void> {
    const deployment: DeploymentEntity =
        await this.deploymentsRepository.findOne({ id: deploymentId })
    if (deployment) {
      throw new BadRequestException('Deployment already exists')
    }
  }

  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return this.deploymentsRepository.find({ relations: ['modules'] })
      .then(deployments => deployments.map(deployment => deployment.toReadDto()))
  }

  public async getDeploymentById(id: string): Promise<ReadDeploymentDto> {
    return this.deploymentsRepository.findOne({where: { id }, relations: ['modules']})
      .then(deployment => deployment.toReadDto())
  }
}
