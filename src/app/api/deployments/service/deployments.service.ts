import { Injectable } from '@nestjs/common'
import { CreateDeploymentDto, ReadDeploymentDto } from '../dto'
import { FinishDeploymentDto } from '../../notifications/dto'
import { ComponentDeploymentEntity, DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentStatusEnum } from '../enums'
import { NotificationStatusEnum } from '../../notifications/enums'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'
import { MooveService } from '../../../core/integrations/moove'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { QueuedDeploymentsService } from './queued-deployments.service'

@Injectable()
export class DeploymentsService {

  constructor(
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly mooveService: MooveService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly queuedDeploymentsService: QueuedDeploymentsService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>
  ) {}

  public async createDeployment(createDeploymentDto: CreateDeploymentDto): Promise<ReadDeploymentDto> {
    this.consoleLoggerService.log(`START:CREATE_DEPLOYMENT`, createDeploymentDto)
    const deployment: DeploymentEntity =
      await this.deploymentsRepository.save(createDeploymentDto.toEntity())

    await this.queuedDeploymentsService.queueDeploymentTasks(deployment)
    const deploymentReadDto: ReadDeploymentDto = deployment.toReadDto()
    this.consoleLoggerService.log(`FINISH:CREATE_DEPLOYMENT`, deploymentReadDto)
    return deploymentReadDto
  }

  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return this.deploymentsRepository.find({ relations: ['modules'] })
      .then(deployments => deployments.map(deployment => deployment.toReadDto()))
  }

  public async getDeploymentById(id: string): Promise<ReadDeploymentDto> {
    return this.deploymentsRepository.findOne({where: { id }, relations: ['modules']})
      .then(deployment => deployment.toReadDto())
  }

  public async finishDeployment(
    componentDeploymentId: string,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)

    const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentRepository.findOne({
            where: {id: componentDeploymentId},
            relations: ['moduleDeployment', 'moduleDeployment.deployment']
          })

    let status = DeploymentStatusEnum.FAILED

    if (finishDeploymentDto &&
        finishDeploymentDto.status &&
        finishDeploymentDto.status === NotificationStatusEnum.SUCCEEDED) {

      status = DeploymentStatusEnum.FINISHED
    }

    const deployment: DeploymentEntity =
        await this.deploymentsRepository.findOne({
          where: { id: componentDeployment.moduleDeployment.deployment.id },
          relations: ['modules']
        })

    this.deploymentsStatusManagementService.deepUpdateDeploymentStatus(deployment, status)

    await this.mooveService.notifyDeploymentStatus(deployment.id, finishDeploymentDto.status, deployment.callbackUrl)

    this.consoleLoggerService.log('FINISH:FINISH_DEPLOYMENT_NOTIFICATION')
  }
}
