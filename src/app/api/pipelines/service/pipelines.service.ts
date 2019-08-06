import { Injectable } from '@nestjs/common';
import { SpinnakerService } from '../../../core/integrations/spinnaker/spinnaker.service';

@Injectable()
export class PipelinesService {

  constructor(private readonly spinnakerService: SpinnakerService) {}

  public getPipelines(): string[] {
    return this.spinnakerService.getPipelines();
  }
}
