import { Module } from '@nestjs/common'
import { IntegrationsModule } from './integrations/integrations.module'
import { LogsModule } from './logs/logs.module'

@Module({
  imports: [
    IntegrationsModule,
    LogsModule
  ]
})
export class CoreModule {}
