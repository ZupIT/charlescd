import { InjectRepository } from '@nestjs/typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console/console-logger.service'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedResponse } from '../dto/paginated-response.dto'
import { Execution } from '../entity/execution.entity'
import { ExecutionRepository } from '../repository/execution.repository'

export class PaginatedExecutionsUseCase {

  private readonly maxPageSize = 50

  constructor(
    @InjectRepository(ExecutionRepository)
    private readonly executionRepository: ExecutionRepository,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async execute(params: ExecutionQuery): Promise<PaginatedResponse<Execution>>{
    this.consoleLoggerService.log('START:START_EXECUTIONS_PAGINATION', { params: params })
    const [executions, total] = await this.executionRepository.listExecutionsAndRelations(this.getPageSize(params.size), params.page, params.current)
    const totalPages = Math.round(Math.ceil(total / params.size))
    const response = new PaginatedResponse<Execution>(executions, executions.length, params.page, totalPages)
    return response
  }

  private getPageSize(actualPageSize: number): number {
    return Math.min(actualPageSize, this.maxPageSize)
  }
}
