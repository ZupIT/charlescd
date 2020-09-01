import { Execution } from '../../entity/execution.entity'

export interface PaginatedExecutions {
  executions: Execution[]
  page: number
  size: number
  totalPages: number
  last: boolean
}
