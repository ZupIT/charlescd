import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { DeploymentNotificationRequestDto } from '../dto/deployment-notification-request.dto'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedExecutions } from '../dto/execution/paginated-executions.dto'
import { Execution } from '../entity/execution.entity'
import { PaginatedExecutionsUseCase } from '../use-cases/paginated-executions.usecase'
import { ReceiveNotificationUseCase } from '../use-cases/receive-notification.usecase'

@Controller('v2/executions')
export class ExecutionsController {
  constructor(
    private receiveNotificationUseCase: ReceiveNotificationUseCase,
    private paginatedExecutionsUseCase: PaginatedExecutionsUseCase
  ) { }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async allExecutions(
    @Query() params: ExecutionQuery,
  ): Promise<PaginatedExecutions> {
    return await this.paginatedExecutionsUseCase.execute(params)
  }

  @Post('/:id/notify')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async receiveNotification(
    @Param('id') executionId: string,
    @Body() deploymentNotification: DeploymentNotificationRequestDto,
  ): Promise<Execution> {
    return await this.receiveNotificationUseCase.execute(executionId, deploymentNotification)
  }
}
