import { Module } from '@nestjs/common'
import { NotificationsController } from './controller'
import { DeploymentsModule } from '../deployments/deployments.module'
import { NotificationsService } from './services'
import { IntegrationsModule } from '../../core/integrations/integrations.module'
import { LogsModule } from '../../core/logs/logs.module'
import { ServicesModule } from '../../core/services/services.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentDeploymentEntity, DeploymentEntity } from '../deployments/entity'

@Module({
  imports: [
    DeploymentsModule,
    IntegrationsModule,
    LogsModule,
    ServicesModule,
    TypeOrmModule.forFeature([
      ComponentDeploymentEntity,
      DeploymentEntity
    ])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
