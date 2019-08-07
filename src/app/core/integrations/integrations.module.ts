import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker/spinnaker.service'

@Module({
  imports: [HttpModule],
  providers: [SpinnakerService],
  exports: [SpinnakerService]
})
export class IntegrationsModule {}
