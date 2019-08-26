import { Injectable } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import { ComponentDeploymentEntity, DeploymentEntity } from '../../deployments/entity'
import { DeploymentStatusEnum } from '../../deployments/enums'
import { NotificationStatusEnum } from '../enums'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MooveService } from '../../../core/integrations/moove'
import { DeploymentsStatusManagementService } from '../../../core/services/deployments-status-management-service'

@Injectable()
export class NotificationsService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly mooveService: MooveService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    @InjectRepository(ComponentDeploymentEntity)
    private readonly componentDeploymentRepository: Repository<ComponentDeploymentEntity>,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  public async finishDeployment(
    componentDeploymentId: string,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)
pi
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
