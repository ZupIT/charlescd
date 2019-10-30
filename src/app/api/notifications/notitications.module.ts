import { Module } from '@nestjs/common'
import { NotificationsController } from './controller'
import { DeploymentsModule } from '../deployments/deployments.module'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { LogsModule } from '../../core/logs/logs.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, QueuedDeploymentEntity } from '../deployments/entity'
import { ComponentDeploymentsRepository, QueuedDeploymentsRepository } from '../deployments/repository'
import { ReceiveDeploymentCallbackUsecase } from './use-cases'
import {ServicesModule} from '../../core/services/services.module'

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
      QueuedDeploymentsRepository
    ])
  ],
  controllers: [
    NotificationsController
  ],
  providers: [
    ReceiveDeploymentCallbackUsecase
  ]
})
export class NotificationsModule {}
