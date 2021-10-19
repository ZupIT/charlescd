/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Controller, Get, Query, UsePipes } from '@nestjs/common'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import { PaginatedResponse } from '../dto/paginated-response.dto'
import { Execution } from '../entity/execution.entity'
import { PaginatedExecutionsUseCase } from '../use-cases/paginated-executions.usecase'
import { JoiValidationExecutionPipe } from '../pipes/joi-validation-execution-pipe'

@Controller('v2/executions')
export class ExecutionsController {
  constructor(
    private paginatedExecutionsUseCase: PaginatedExecutionsUseCase
  ) { }

  @Get('/')
  @UsePipes(new JoiValidationExecutionPipe())
  public async allExecutions(
    @Query() params: ExecutionQuery,
  ): Promise<PaginatedResponse<Execution>> {
    return await this.paginatedExecutionsUseCase.execute(params)
  }
}
