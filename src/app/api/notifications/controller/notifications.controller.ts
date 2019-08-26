import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common'
import { FinishDeploymentDto } from '../dto'
import { NotificationsService } from '../services'

@Controller('notifications')
export class NotificationsController {

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(204)
  public async onFinishingDeployment(
    @Query('componentDeploymentId') componentDeploymentId: string,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {

    return await this.notificationsService.finishDeployment(componentDeploymentId, finishDeploymentDto)
  }
}
