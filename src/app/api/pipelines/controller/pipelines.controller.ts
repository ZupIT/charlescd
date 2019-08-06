import { Controller, Get } from '@nestjs/common';
import { PipelinesService } from '../service/pipelines.service';

@Controller('pipelines')
export class PipelinesController {

  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get('/')
  public getPipelines(): string[] {
    return this.pipelinesService.getPipelines();
  }
}
