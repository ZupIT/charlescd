import { InjectRepository } from '@nestjs/typeorm'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedExecutions } from '../dto/execution/paginated-executions.dto'
import { ExecutionRepository } from '../repository/execution.repository'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'

export class PaginatedExecutionsUseCase {
  constructor(
    @InjectRepository(ExecutionRepository)
    private executionRepository: ExecutionRepository,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async execute(params: ExecutionQuery): Promise<PaginatedExecutions>{
    this.consoleLoggerService.log('START:START_EXECUTIONS_PAGINATION', { params: params })
    const executions = await this.executionRepository.listExecutionsAndRelations(params.active, params.size, params.page)
    const totalPages = Math.round(Math.ceil(executions[1] / params.size))
    const response : PaginatedExecutions = {
      executions: executions[0],
      totalPages: totalPages,
      size: params.size,
      page: params.page,
      last: params.page === (totalPages -1)
    }
    return response
  }
}
