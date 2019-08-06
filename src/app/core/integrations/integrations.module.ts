import { HttpModule, Module } from '@nestjs/common';
import { SpinnakerService } from './spinnaker/spinnaker.service';

@Module({
  imports: [HttpModule],
  providers: [SpinnakerService]
})
export class IntegrationsModule {}
