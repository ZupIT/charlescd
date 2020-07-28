/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import {
  Controller,
  Get,
  Param, UsePipes, ValidationPipe
} from '@nestjs/common'
import { ReadQueuedDeploymentDto } from '../../deployments/dto'
import { GetComponentQueueUseCase } from '../use-cases/get-component-queue.usecase'
import {ComponentsExistencePipe} from '../pipe/components.pipe'
import { BaseController } from '../../base.controller'

@Controller('components')
export class ComponentsController extends BaseController {

  constructor(private readonly getComponentQueueUseCase: GetComponentQueueUseCase) { super() }

  @Get(':id/queue')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UsePipes(ComponentsExistencePipe)
  public async getComponentDeploymentQueue(@Param('id') id: string): Promise<ReadQueuedDeploymentDto[]> {
    return await this.getComponentQueueUseCase.execute(id)
  }

}
