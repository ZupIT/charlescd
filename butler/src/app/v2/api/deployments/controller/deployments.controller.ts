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

import { Body, Controller, Headers, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { DeploymentNotificationRequestDto } from '../dto/deployment-notification-request.dto'
import { ReadDeploymentDto } from '../dto/read-deployment.dto'
import { ReadUndeploymentDto } from '../dto/read-undeployment.dto'
import { Execution } from '../entity/execution.entity'
import { CdConfigurationExistencePipe, SimultaneousDeploymentValidationPipe } from '../pipes'
import { CreateDeploymentUseCase } from '../use-cases/create-deployment.usecase'
import { CreateUndeploymentUseCase } from '../use-cases/create-undeployment.usecase'
import { ReceiveNotificationUseCase } from '../use-cases/receive-notification.usecase'

@Controller('v2/deployments')
export class DeploymentsController {

  constructor(
    private createDeploymentUseCase: CreateDeploymentUseCase,
    private createUndeploymentUseCase: CreateUndeploymentUseCase,
    private receiveNotificationUseCase: ReceiveNotificationUseCase
  ) { }

  @Post('/')
  @UsePipes(SimultaneousDeploymentValidationPipe)
  @UsePipes(CdConfigurationExistencePipe)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createDeployment(
    @Body() createDeploymentRequestDto: CreateDeploymentRequestDto,
    @Headers('x-circle-id') incomingCircleId: string | null,
  ): Promise<ReadDeploymentDto> {
    return this.createDeploymentUseCase.execute(createDeploymentRequestDto, incomingCircleId)
  }

  @Post('/:id/undeploy')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createUndeployment(
    @Param('id') deploymentId: string,
    @Headers('x-circle-id') incomingCircleId: string | null
  ): Promise<ReadUndeploymentDto> {
    return this.createUndeploymentUseCase.execute(deploymentId, incomingCircleId)
  }
}
