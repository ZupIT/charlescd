import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateUndeploymentDto } from '../dto/create-undeployment';
import { ReadUndeploymentDto } from '../dto/read-undeployment';

import {
  CreateUndeploymentRequestUsecase
} from '../use-cases';

@Controller('undeployments')
export class UndeploymentsController {
  constructor(
    private readonly createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase,
  ) {}

  @Post()
  public async createUndeployment(
    @Body() createUndeploymentDto: CreateUndeploymentDto,
    @Headers('x-circle-id') circleId: string
  ): Promise<ReadUndeploymentDto> {

    return await this.createUndeploymentRequestUsecase.execute(createUndeploymentDto, circleId)
  }
}
