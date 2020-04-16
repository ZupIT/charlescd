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
import {concatMap, delay, map, retryWhen, tap} from 'rxjs/operators';
import {of, throwError} from 'rxjs';

@Injectable()
export class PipelineErrorHandlerService {
    private readonly MAXIMUM_RETRY_ATTEMPTS = 3
    private readonly MILLISECONDS_RETRY_DELAY = 1000
    constructor(
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly statusManagementService: StatusManagementService,
        private readonly mooveService: MooveService,
        private readonly pipelineQueuesService: PipelineQueuesService,
        @InjectRepository(QueuedDeploymentsRepository)
        private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
        @InjectRepository(ComponentEntity)
        private readonly componentsRepository: Repository<ComponentEntity>
    ) {}

    public async handleDeploymentFailure(deployment: DeploymentEntity): Promise<void> {

        if (deployment && !deployment.hasFailed()) {
            await this.statusManagementService.deepUpdateDeploymentStatus(deployment, DeploymentStatusEnum.FAILED)
            await this.mooveService.notifyDeploymentStatus(
                deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId
            ).pipe(
                map(response=>response),
                retryWhen(error=> this.getNotificationRetryCondition(error))
             ).toPromise()
        }
    }

    private getNotificationRetryCondition(deployError) {

        return deployError.pipe(
            concatMap((error, attempts) => {
                return attempts >= this.MAXIMUM_RETRY_ATTEMPTS ?
                    throwError('Reached maximum attemps.') :
                    this.getNotificationRetryPipe(error, attempts)
            })
        )
    }

    private getNotificationRetryPipe(error, attempts: number) {

        return of(error).pipe(
            tap(() => this.consoleLoggerService.log(`Deploy attempt #${attempts + 1}. Retrying deployment: ${error}`)),
            delay(this.MILLISECONDS_RETRY_DELAY)
        )
    }

    public async handleComponentDeploymentFailure(
        componentDeployment: ComponentDeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity,
        circle: CircleDeploymentEntity
    ): Promise<void> {

        const component: ComponentEntity = await this.componentsRepository.findOne({ id: componentDeployment.componentId })
        await this.removeComponentPipelineCircle(component, circle)
        await this.queuedDeploymentsRepository.update({ id: queuedDeployment.id }, { status: QueuedPipelineStatusEnum.FINISHED })
        this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
    }

    public async handleUndeploymentFailure(undeployment: UndeploymentEntity): Promise<void> {

        if (undeployment && !undeployment.hasFailed()) {
            await this.statusManagementService.deepUpdateUndeploymentStatus(undeployment, UndeploymentStatusEnum.FAILED)
            this.mooveService.notifyDeploymentStatus(
                undeployment.deployment.id, NotificationStatusEnum.UNDEPLOY_FAILED,
                undeployment.deployment.callbackUrl, undeployment.deployment.circleId
            ).pipe(
                map(response=>response),
                retryWhen(error=> this.getNotificationRetryCondition(error))
            )
        }
    }

    public async handleComponentUndeploymentFailure(
        componentDeployment: ComponentDeploymentEntity,
        queuedDeployment: QueuedDeploymentEntity
    ): Promise<void> {

        await this.queuedDeploymentsRepository.update({ id: queuedDeployment.id }, { status: QueuedPipelineStatusEnum.FINISHED })
        this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
    }

    private async removeComponentPipelineCircle(
        component: ComponentEntity,
        circle: CircleDeploymentEntity
    ): Promise<void> {

        try {
            component.removePipelineCircle(circle)
            await this.componentsRepository.save(component)
        } catch (error) {
            throw new InternalServerErrorException('Could not update component pipeline on component deployment failure')
        }
    }
}
