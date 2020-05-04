import { Module } from '@nestjs/common'
import { DeploymentsModule } from './deployments/deployments.module'
import { ModulesModule } from './modules/modules.module'
import { HealthcheckModule } from './healthcheck/healthcheck.module'
import { NotificationsModule } from './notifications/notitications.module'
import { ComponentsModule } from './components/components.module'
import { ConfigurationsModule } from './configurations/configurations.module'

@Module({
  imports: [
    DeploymentsModule,
    ModulesModule,
    HealthcheckModule,
    NotificationsModule,
    ComponentsModule,
    ConfigurationsModule
  ]
})
export class ApiModule {}
