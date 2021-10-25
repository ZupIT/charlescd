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

import { Controller, Post, Body, HttpCode } from '@nestjs/common'
import { RouteHookParams } from '../interfaces/params.interface'
import { HookReconcileResponseDto } from '../dto/hook-reconcile-response.dto'
import { ReconcileRoutesUsecase } from '../use-cases/reconcile-routes.usecase'

@Controller('/')
export class RoutesHookController {

  constructor(
    private readonly createRoutesUseCase: ReconcileRoutesUsecase
  ) { }

  @Post('/v2/operator/routes/hook/reconcile')
  @HttpCode(200)
  public async reconcile(@Body() params: RouteHookParams): Promise<HookReconcileResponseDto> {
    return await this.createRoutesUseCase.execute(params)
  }
}
