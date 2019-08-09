import { Module } from '@nestjs/common'
import { DeploymentsModule } from './deployments/deployments.module'
import { ModulesModule } from './modules/modules.module'

@Module({
  imports: [
    DeploymentsModule,
    ModulesModule
  ]
})
export class ApiModule {}
