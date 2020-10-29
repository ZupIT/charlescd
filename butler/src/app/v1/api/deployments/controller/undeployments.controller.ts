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

import { Body, Controller, Headers, Post } from '@nestjs/common'
import { CreateUndeploymentDto } from '../dto/create-undeployment'
import { ReadUndeploymentDto } from '../dto/read-undeployment'

import {
  CreateUndeploymentRequestUsecase
} from '../use-cases'
import { BaseController } from '../../base.controller'

@Controller('undeployments')
export class UndeploymentsController extends BaseController{
  constructor(
    private readonly createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase,
  ) { super() }

  @Post()
  public async createUndeployment(
    @Body() createUndeploymentDto: CreateUndeploymentDto,
    @Headers('x-circle-id') circleId: string
  ): Promise<ReadUndeploymentDto> {

    return await this.createUndeploymentRequestUsecase.execute(createUndeploymentDto, circleId)
  }
}
