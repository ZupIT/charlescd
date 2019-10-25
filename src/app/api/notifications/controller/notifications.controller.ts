import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import { ReceiveDeploymentCallbackUsecase } from '../use-cases'

@Controller('notifications')
export class NotificationsController {

  constructor(
    private readonly receiveDeploymentCallbackUsecase: ReceiveDeploymentCallbackUsecase
  ) {}

  @Post()
  @HttpCode(204)
  public async receiveDeploymentCallback(
    @Query('componentDeploymentId') componentDeploymentId: string,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    return await this.receiveDeploymentCallbackUsecase.execute(componentDeploymentId, finishDeploymentDto)
  }
}
