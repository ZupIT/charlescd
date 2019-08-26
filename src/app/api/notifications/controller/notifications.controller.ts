import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common'
import { DeploymentsService } from '../../deployments/services'
import { FinishDeploymentDto } from '../dto'

@Controller('notifications')
export class NotificationsController {

  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  @HttpCode(204)
  public async onFinishingDeployment(
    @Query('componentDeploymentId') componentDeploymentId: string,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {
    return await this.deploymentsService.finishDeployment(componentDeploymentId, finishDeploymentDto)
  }

}
