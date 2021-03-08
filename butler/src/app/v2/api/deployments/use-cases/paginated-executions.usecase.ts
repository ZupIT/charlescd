import { InjectRepository } from '@nestjs/typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console/console-logger.service'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedExecutions } from '../dto/execution/paginated-executions.dto'
import { ExecutionRepository } from '../repository/execution.repository'

export class PaginatedExecutionsUseCase {
  constructor(
    @InjectRepository(ExecutionRepository)
    private readonly executionRepository: ExecutionRepository,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async execute(params: ExecutionQuery): Promise<PaginatedExecutions>{
    this.consoleLoggerService.log('START:START_EXECUTIONS_PAGINATION', { params: params })
    const [executions, total] = await this.executionRepository.listExecutionsAndRelations(params.active, params.size, params.page)
    const totalPages = Math.round(Math.ceil(total / params.size))
    const response : PaginatedExecutions = {
      executions: executions,
      size: params.size,
      page: params.page,
      last: params.page === (totalPages -1)
    }
    return response
  }
}
