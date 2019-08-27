import { Controller, Get, Param } from '@nestjs/common'
import { ComponentsService } from '../services'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'

@Controller('components')
export class ComponentsController {

  constructor(private readonly componentsService: ComponentsService) {}

  @Get(':id/queue')
  public async getComponentDeploymentQueue(@Param('id') id: string): Promise<ReadQueuedDeploymentDto[]> {
    return await this.componentsService.getComponentDeploymentQueue(id)
  }
}
