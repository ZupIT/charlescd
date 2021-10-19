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

import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { HookParams } from '../interfaces/params.interface'
import { ReconcileDeploymentUsecase } from '../use-cases/reconcile-deployment.usecase'

@Controller('/')
export class DeploymentsHookController {

  constructor(
    private readonly reconcileDeploymentUsecase: ReconcileDeploymentUsecase,
  ) { }

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  public async reconcile(@Body() params: HookParams) : Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    return await this.reconcileDeploymentUsecase.execute(params)
  }
}
