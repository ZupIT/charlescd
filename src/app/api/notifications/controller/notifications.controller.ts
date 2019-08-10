import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { DeploymentsService } from '../../deployments/service';
import { FinishDeploymentDto } from '../dto'

@Controller('notifications')
export class NotificationsController {

  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post('deployment/:id')
  public async onFinishingDeployment(
    @Param('id') deploymentId: string,
    @Body() finishDeploymentDto: FinishDeploymentDto
  ): Promise<void> {
    return await this.deploymentsService.finishDeployment(deploymentId, finishDeploymentDto)
  }

}
