import { HttpModule, Module } from '@nestjs/common'
import { SpinnakerService } from './spinnaker'

@Module({
  imports: [HttpModule],
  providers: [SpinnakerService],
  exports: [SpinnakerService]
})
export class IntegrationsModule {}
