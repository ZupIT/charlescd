import { Module } from '@nestjs/common'
import { NotificationsController } from './controller'
import { DeploymentsModule } from '../deployments/deployments.module'

@Module({
  imports: [
    DeploymentsModule
  ],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
