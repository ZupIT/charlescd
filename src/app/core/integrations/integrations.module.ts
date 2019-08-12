import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker'
import { DeploymentConfigurationService } from './configuration'
import { MooveService } from './moove'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [
    HttpModule,
    ServicesModule
  ],
  providers: [
    SpinnakerService,
    DeploymentConfigurationService,
    MooveService
  ],
  exports: [
    SpinnakerService,
    DeploymentConfigurationService,
    MooveService
  ]
})
export class IntegrationsModule {}
