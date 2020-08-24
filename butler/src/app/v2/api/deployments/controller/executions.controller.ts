import { ReceiveNotificationUseCase } from '../use-cases/receive-notification.usecase'
import { Post, UsePipes, ValidationPipe, Param, Body, Controller } from '@nestjs/common'
import { DeploymentNotificationRequestDto } from '../dto/deployment-notification-request.dto'
import { Execution } from '../entity/execution.entity'

@Controller('v2/executions')
export class ExecutionsController {
  constructor(
    private receiveNotificationUseCase: ReceiveNotificationUseCase
  ) { }

  @Post('/:id/notify')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async receiveNotification(
    @Param('id') executionId: string,
    @Body() deploymentNotification: DeploymentNotificationRequestDto,
  ): Promise<Execution> {
    return await this.receiveNotificationUseCase.execute(executionId, deploymentNotification)
  }
}
