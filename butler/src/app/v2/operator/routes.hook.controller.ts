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

import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common'
import { RouteHookParams } from './params.interface'
import { HookReconcileResponseDto } from './hook-reconcile-response.dto'
import { CreateRoutesManifestsUseCase } from './use-cases/create-routes-manifests.usecase'

@Controller('/')
export class RoutesHookController {

  constructor(
    private readonly createRoutesUseCase: CreateRoutesManifestsUseCase
  ) { }

  @Post('/v2/operator/routes/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: RouteHookParams): Promise<HookReconcileResponseDto> {
    return await this.createRoutesUseCase.execute(params)
  }
}
