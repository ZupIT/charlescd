import { InjectRepository } from '@nestjs/typeorm'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedExecutions } from '../dto/execution/paginated-executions.dto'
import { ExecutionRepository } from '../repository/execution.repository'

export class PaginatedExecutionsUseCase {
  constructor(
    @InjectRepository(ExecutionRepository)
    private executionRepository: ExecutionRepository,

  ) { }

  public async execute(params: ExecutionQuery) : Promise<PaginatedExecutions>{
    const executions = await this.executionRepository.listExecutionsAndRelations(params.active, params.pageSize, params.page)
    const response : PaginatedExecutions = {
      executions: executions
    }
    return response
  }
}
