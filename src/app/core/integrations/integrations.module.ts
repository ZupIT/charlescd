import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker'
import { DeploymentConfigurationService } from './configuration'
import { MooveService } from './moove'

@Module({
  imports: [HttpModule],
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
