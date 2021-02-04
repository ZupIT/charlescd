import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedExecutions } from '../dto/execution/paginated-executions.dto'
import { PaginatedExecutionsUseCase } from '../use-cases/paginated-executions.usecase'

@Controller('v2/executions')
export class ExecutionsController {
  constructor(
    private paginatedExecutionsUseCase: PaginatedExecutionsUseCase
  ) { }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async allExecutions(
    @Query() params: ExecutionQuery,
  ): Promise<PaginatedExecutions> {
    return await this.paginatedExecutionsUseCase.execute(params)
  }
}
