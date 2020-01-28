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

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  public async createDeployment(createDeploymentDto: CreateDeploymentDto, circleId: string): Promise<ReadDeploymentDto> {
    try {
      this.consoleLoggerService.log(`START:CREATE_DEPLOYMENT`, createDeploymentDto)
      await this.verifyIfDeploymentExists(createDeploymentDto.deploymentId)
      const deployment: DeploymentEntity =
          await this.deploymentsRepository.save(createDeploymentDto.toEntity(circleId))
      await this.pipelineQueuesService.queueDeploymentTasks(deployment)
      const deploymentReadDto: ReadDeploymentDto = deployment.toReadDto()
      this.consoleLoggerService.log(`FINISH:CREATE_DEPLOYMENT`, deploymentReadDto)
      return deploymentReadDto
    } catch (error) {
      // await this.deploymentsStatusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
      // notifyApplication
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
