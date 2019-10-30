import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
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
    @Query('componentDeploymentId') componentDeploymentId: string,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    return await this.receiveDeploymentCallbackUsecase.execute(componentDeploymentId, finishDeploymentDto)
  }

  @Post('/undeployment')
  @HttpCode(204)
  public async receiveUndeploymentCallback(
    @Query('componentUndeploymentId') componentUndeploymentId: string,
    @Body() finishUndeploymentDto: any //FinishUndeploymentDto
  ): Promise<void> {

    return await this.receiveUndeploymentCallbackUsecase.execute(componentUndeploymentId, finishUndeploymentDto)
  }
}
