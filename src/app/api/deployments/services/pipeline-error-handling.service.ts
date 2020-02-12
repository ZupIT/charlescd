import { Injectable } from '@nestjs/common'
import { ConsoleLoggerService } from '../../../core/logs/console'
import {
    ComponentDeploymentEntity,
    DeploymentEntity,
    QueuedDeploymentEntity,
    UndeploymentEntity
} from '../entity'
import {
    DeploymentStatusEnum,
    QueuedPipelineStatusEnum,
    UndeploymentStatusEnum
} from '../enums'
import { NotificationStatusEnum } from '../../notifications/enums'
import { StatusManagementService } from '../../../core/services/deployments'
import { MooveService } from '../../../core/integrations/moove'
import { PipelineQueuesService } from './pipeline-queues.service'
import { InjectRepository } from '@nestjs/typeorm'
import { QueuedDeploymentsRepository } from '../repository'

@Injectable()
export class PipelineErrorHandlingService {

    constructor(
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly statusManagementService: StatusManagementService,
        private readonly mooveService: MooveService,
        private readonly pipelineQueuesService: PipelineQueuesService,
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository
    ) {}

    public async handleDeploymentFailure(deployment: DeploymentEntity): Promise<void> {

        if (deployment && !deployment.hasFailed()) {
            await this.statusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
            await this.mooveService.notifyDeploymentStatus(
                deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId
            )
        }
    }

    public async handleComponentDeploymentFailure(
        componentDeployment: ComponentDeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity
    ): Promise<void> {

        await this.queuedDeploymentsRepository.update({ id: queuedDeployment.id }, { status: QueuedPipelineStatusEnum.FINISHED })
        this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
    }

    public async handleUndeploymentFailure(undeployment: UndeploymentEntity): Promise<void> {

        if (undeployment && !undeployment.hasFailed()) {
            await this.statusManagementService.deepUpdateUndeploymentStatus(undeployment, UndeploymentStatusEnum.FAILED)
            await this.mooveService.notifyDeploymentStatus(
                undeployment.deployment.id, NotificationStatusEnum.UNDEPLOY_FAILED,
                undeployment.deployment.callbackUrl, undeployment.deployment.circleId
            )
        }
    }
}
