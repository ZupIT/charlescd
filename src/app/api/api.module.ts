import { Module } from '@nestjs/common'
import { DeploymentsModule } from './deployments/deployments.module'
import { ModulesModule } from './modules/modules.module'
import { HealthcheckModule } from './healthcheck/healthcheck.module'
import { NotificationsModule } from './notifications/notitications.module'

@Module({
  imports: [
    DeploymentsModule,
    ModulesModule,
    HealthcheckModule,
    NotificationsModule
  ]
})
export class ApiModule {}