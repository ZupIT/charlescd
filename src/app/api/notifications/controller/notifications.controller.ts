import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common'
import { FinishDeploymentDto, FinishUndeploymentDto } from '../dto'
import { ReceiveDeploymentCallbackUsecase, ReceiveUndeploymentCallbackUsecase } from '../use-cases'

@Controller('notifications')
export class NotificationsController {

  constructor(
    private readonly receiveDeploymentCallbackUsecase: ReceiveDeploymentCallbackUsecase,
    private readonly receiveUndeploymentCallbackUsecase: ReceiveUndeploymentCallbackUsecase
  ) {}

  @Post('/deployment')
  @HttpCode(204)
  public async receiveDeploymentCallback(
    @Query('queuedDeploymentId') queuedDeploymentId: number,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    return await this.receiveDeploymentCallbackUsecase.execute(queuedDeploymentId, finishDeploymentDto)
  }

  @Post('/undeployment')
  @HttpCode(204)
  public async receiveUndeploymentCallback(
    @Query('queuedUndeploymentId') queuedUndeploymentId: number,
    @Body() finishUndeploymentDto: FinishUndeploymentDto
  ): Promise<void> {

    return await this.receiveUndeploymentCallbackUsecase.execute(queuedUndeploymentId, finishUndeploymentDto)
  }
}
