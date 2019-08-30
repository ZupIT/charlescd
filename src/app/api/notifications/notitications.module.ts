import { Module } from '@nestjs/common'
import { NotificationsController } from './controller'
import { DeploymentsModule } from '../deployments/deployments.module'
import { NotificationsService } from './services'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { LogsModule } from '../../core/logs/logs.module'
import { ServicesModule } from '../../core/services/services.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity, QueuedDeploymentEntity } from '../deployments/entity'
import { QueuedDeploymentsRepository } from '../deployments/repository'

@Module({
  imports: [
    DeploymentsModule,
    IntegrationsModule,
    LogsModule,
    ServicesModule,
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      DeploymentEntity,
      QueuedDeploymentEntity,
      QueuedDeploymentsRepository
    ])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
