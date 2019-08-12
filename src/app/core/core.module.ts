import { Module } from '@nestjs/common'
import { IntegrationsModule } from './integrations/integrations.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [
    IntegrationsModule,
    ServicesModule
  ]
})
export class CoreModule {}
