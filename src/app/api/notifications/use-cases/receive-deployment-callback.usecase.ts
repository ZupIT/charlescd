import { Injectable } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  QueuedDeploymentEntity
} from '../../deployments/entity'
import { NotificationStatusEnum } from '../enums'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { MooveService } from '../../../core/integrations/moove'
import {
  PipelineErrorHandlerService,
  PipelineQueuesService
} from '../../deployments/services'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ComponentDeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../deployments/repository'
import { Repository } from 'typeorm'
import { StatusManagementService } from '../../../core/services/deployments'
import { of, throwError } from 'rxjs';


@Injectable()
export class ReceiveDeploymentCallbackUsecase {
  private readonly MAXIMUM_RETRY_ATTEMPTS = 3
  private readonly MILLISECONDS_RETRY_DELAY = 1000
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly pipelineErrorHandlerService: PipelineErrorHandlerService,
    private readonly mooveService: MooveService,
    private readonly statusManagementService: StatusManagementService,
    private readonly pipelineQueuesService: PipelineQueuesService,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  public async execute(
    queuedDeploymentId: number,
    finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    try {
      this.consoleLoggerService.log('START:FINISH_DEPLOYMENT_NOTIFICATION', finishDeploymentDto)
      const queuedDeploymentEntity: QueuedDeploymentEntity =
          await this.queuedDeploymentsRepository.findOne({id : queuedDeploymentId})
      if (queuedDeploymentEntity.isRunning()) {
        finishDeploymentDto.isSuccessful() ?
            await this.handleDeploymentSuccess(queuedDeploymentId) :
            await this.handleDeploymentFailure(queuedDeploymentId)
        this.consoleLoggerService.log('FINISH:FINISH_DEPLOYMENT_NOTIFICATION')
      }
    } catch (error) {
      return Promise.reject({ error })
    }
  }

  private async handleDeploymentFailure(
    queuedDeploymentId: number
  ): Promise<void> {

    this.consoleLoggerService.log('START:DEPLOYMENT_FAILURE_WEBHOOK', { queuedDeploymentId })
    const queuedDeployment: QueuedDeploymentEntity = await this.queuedDeploymentsRepository.findOne({ id: queuedDeploymentId })
    const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(queuedDeployment.componentDeploymentId)
    const { moduleDeployment: { deployment } } = componentDeployment

    await this.pipelineErrorHandlerService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment, deployment.circle)
    await this.pipelineErrorHandlerService.handleDeploymentFailure(deployment)
    this.consoleLoggerService.log('FINISH:DEPLOYMENT_FAILURE_WEBHOOK', { queuedDeploymentId })
  }

  private async notifyMooveIfDeploymentFinished(
    componentDeploymentId: string
  ): Promise<void> {

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const { moduleDeployment: { deployment } } = componentDeployment

    if (deployment.hasFinished()) {

      await this.mooveService.notifyDeploymentStatus(
        deployment.id, NotificationStatusEnum.SUCCEEDED, deployment.callbackUrl, deployment.circleId
      ).pipe(
          map(response => response),
          retryWhen(error => this.getNotificationRetryCondition(error))
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


  private async handleDeploymentSuccess(
    queuedDeploymentId: number
  ): Promise<void> {
    this.consoleLoggerService.log('START:DEPLOYMENT_SUCCESS_WEBHOOK', { queuedDeploymentId })
    const queuedDeployment: QueuedDeploymentEntity = await this.queuedDeploymentsRepository.findOne({ id: queuedDeploymentId })
    const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.findOne({ id: queuedDeployment.componentDeploymentId })
    await this.pipelineQueuesService.setQueuedDeploymentStatusFinished(queuedDeploymentId)
    this.pipelineQueuesService.triggerNextComponentPipeline(componentDeployment)
    await this.statusManagementService.setComponentDeploymentStatusAsFinished(componentDeployment.id)
    await this.notifyMooveIfDeploymentFinished(componentDeployment.id)
    this.consoleLoggerService.log('FINISH:DEPLOYMENT_SUCCESS_WEBHOOK', { queuedDeploymentId })
  }
}
