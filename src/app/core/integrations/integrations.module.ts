import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker'
import { DeploymentConfigurationService } from './configuration'

@Module({
  imports: [HttpModule],
  providers: [
    SpinnakerService,
    DeploymentConfigurationService
  ],
  exports: [
    SpinnakerService,
    DeploymentConfigurationService
  ]
})
export class IntegrationsModule {}
