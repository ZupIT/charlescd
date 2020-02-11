import {
  Controller,
  Get,
  Param, UsePipes
} from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { ComponentsPipe } from '../pipe/components.pipe'
import { ComponentQueueUseCase } from '../use-cases/component-queue.usecase'

@Controller('components')
export class ComponentsController {

  constructor(private readonly componentQueueUseCase: ComponentQueueUseCase) {}

  @Get(':id/queue')
  @UsePipes(ComponentsPipe)
  public async getComponentDeploymentQueue(@Param('id') id: string): Promise<ReadQueuedDeploymentDto[]> {
    return await this.componentQueueUseCase.execute(id)
  }

}
