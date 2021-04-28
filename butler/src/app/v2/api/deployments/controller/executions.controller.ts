import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedResponse } from '../dto/paginated-response.dto'
import { Execution } from '../entity/execution.entity'
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
  ): Promise<PaginatedResponse<Execution>> {
    return await this.paginatedExecutionsUseCase.execute(params)
  }
}
