import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ConsoleLoggerService } from '../../../core/logs/console'
import {
    CircleDeploymentEntity,
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
import { ComponentEntity } from '../../components/entity'
import { Repository } from 'typeorm'

@Injectable()
export class PipelineErrorHandlerService {

    constructor(
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly statusManagementService: StatusManagementService,
        private readonly mooveService: MooveService,
        private readonly pipelineQueuesService: PipelineQueuesService,
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(ComponentEntity)
        private readonly componentsRepository: Repository<ComponentEntity>
    ) { }

    public async handleDeploymentFailure(deployment: DeploymentEntity | undefined): Promise<void> {
        if (deployment && !deployment.hasFailed()) {
            this.consoleLoggerService.log('START:HANDLE_DEPLOYMENT_FAILURE', deployment)
            await this.statusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
            await this.mooveService.notifyDeploymentStatus(
                deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId
            )
            this.consoleLoggerService.log('FINISH:HANDLE_DEPLOYMENT_FAILURE', deployment)
        }
    }

    public async handleComponentDeploymentFailure(
        componentDeployment: ComponentDeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity,
        circle?: CircleDeploymentEntity
    ): Promise<void> {
        this.consoleLoggerService.log('START:HANDLE_COMPONENT_DEPLOYMENT_FAILURE', componentDeployment)
        const component: ComponentEntity = await this.componentsRepository.findOneOrFail({ id: componentDeployment.componentId })
        if (circle) {
            await this.removeComponentPipelineCircle(component, circle)
        }
        await this.queuedDeploymentsRepository.update({ id: queuedDeployment.id }, { status: QueuedPipelineStatusEnum.FINISHED })
        this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
        this.consoleLoggerService.log('FINISH:HANDLE_COMPONENT_DEPLOYMENT_FAILURE', componentDeployment)
    }

    public async handleUndeploymentFailure(undeployment: UndeploymentEntity | undefined): Promise<void> {
        if (undeployment && !undeployment.hasFailed()) {
            this.consoleLoggerService.log('START:HANDLING_UNDEPLOYMENT_FAILURE', undeployment)
            await this.statusManagementService.deepUpdateUndeploymentStatus(undeployment, UndeploymentStatusEnum.FAILED)
            await this.mooveService.notifyDeploymentStatus(
                undeployment.deployment.id, NotificationStatusEnum.UNDEPLOY_FAILED,
                undeployment.deployment.callbackUrl, undeployment.deployment.circleId
            )
            this.consoleLoggerService.log('FINISH:HANDLING_UNDEPLOYMENT_FAILURE', undeployment)
        }
    }

    public async handleComponentUndeploymentFailure(
        componentDeployment: ComponentDeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity
    ): Promise<void> {
        this.consoleLoggerService.log('START:HANDLE_COMPONENT_UNDEPLOYMENT_FAILURE', componentDeployment)
        await this.queuedDeploymentsRepository.update({ id: queuedDeployment.id }, { status: QueuedPipelineStatusEnum.FINISHED })
        this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
        this.consoleLoggerService.log('FINISH:HANDLE_COMPONENT_UNDEPLOYMENT_FAILURE', componentDeployment)
    }

    private async removeComponentPipelineCircle(
        component: ComponentEntity,
        circle: CircleDeploymentEntity
    ): Promise<void> {

        try {

            component.removePipelineCircle(circle)
            await this.componentsRepository.save(component)
        } catch (error) {
            this.consoleLoggerService.error('ERROR:COULD_NOT_UPDATE_COMPONENT_PIPELINE', error)
            throw new InternalServerErrorException('Could not update component pipeline on component deployment failure')
        }
    }
}
