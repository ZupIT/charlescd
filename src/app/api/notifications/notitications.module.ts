import { Module } from '@nestjs/common'
import { NotificationsController } from './controller'
import { DeploymentsModule } from '../deployments/deployments.module'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { LogsModule } from '../../core/logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  QueuedDeploymentEntity
} from '../deployments/entity'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../deployments/repository'
import {
  ReceiveDeploymentCallbackUsecase,
  ReceiveUndeploymentCallbackUsecase
} from './use-cases'
import { ServicesModule } from '../../core/services/services.module'
import { QueuedUndeploymentEntity } from '../deployments/entity/queued-undeployment.entity'

@Module({
  imports: [
    DeploymentsModule,
    IntegrationsModule,
    LogsModule,
    ServicesModule,
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      ComponentDeploymentsRepository,
      DeploymentEntity,
      QueuedDeploymentEntity,
      QueuedDeploymentsRepository,
      ComponentUndeploymentEntity,
      ComponentUndeploymentsRepository,
      QueuedUndeploymentEntity
    ])
  ],
  controllers: [
    NotificationsController
  ],
  providers: [
    ReceiveDeploymentCallbackUsecase,
    ReceiveUndeploymentCallbackUsecase
  ]
})
export class NotificationsModule {}
