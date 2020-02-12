import {
  Controller,
  Get,
  Param, UsePipes
} from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { ComponentsExistencePipe } from '../pipe/components.pipe'
import { GetComponentQueueUseCase } from '../use-cases/get-component-queue.usecase'

@Controller('components')
export class ComponentsController {

  constructor(private readonly getComponentQueueUseCase: GetComponentQueueUseCase) {}

  @Get(':id/queue')
  @UsePipes(ComponentsExistencePipe)
  public async getComponentDeploymentQueue(@Param('id') id: string): Promise<ReadQueuedDeploymentDto[]> {
    return await this.getComponentQueueUseCase.execute(id)
  }

}
