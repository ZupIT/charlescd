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

import { Body, Controller, Get, Headers, Param, Post, UsePipes } from '@nestjs/common'
import {
  CreateDeploymentRequestDto,
  CreateUndeploymentDto,
  ReadDeploymentDto,
  ReadUndeploymentDto
} from '../dto'
import { DeploymentUniquenessPipe } from '../pipes'
import { DeploymentsService } from '../services'
import { CreateCircleDeploymentRequestUsecase, CreateDefaultDeploymentRequestUsecase, CreateUndeploymentRequestUsecase } from '../use-cases'

@Controller('deployments')
export class DeploymentsController {

  constructor(
    private readonly deploymentsService: DeploymentsService,
    private readonly createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase,
    private readonly createCircleDeploymentRequestUsecase: CreateCircleDeploymentRequestUsecase,
    private readonly createDefaultDeploymentRequestUsecase: CreateDefaultDeploymentRequestUsecase
  ) {}

  @UsePipes(DeploymentUniquenessPipe)
  @Post()
  public async createDeployment(
    @Body() createDeploymentRequestDto: CreateDeploymentRequestDto,
    @Headers('x-circle-id') circleId: string
  ): Promise<ReadDeploymentDto> {
    if (createDeploymentRequestDto.circle != null) {
      return await this.createCircleDeploymentRequestUsecase.execute(createDeploymentRequestDto, circleId)
    }
    return await this.createDefaultDeploymentRequestUsecase.execute(createDeploymentRequestDto, circleId)
  }

  @Post(':id/undeploy')
  public async createUndeployment(
    @Body() createUndeploymentDto: CreateUndeploymentDto,
    @Param('id') deploymentId: string,
    @Headers('x-circle-id') circleId: string
  ): Promise<ReadUndeploymentDto> {

    return await this.createUndeploymentRequestUsecase.execute(createUndeploymentDto, deploymentId, circleId)
  }

  @Get()
  public async getDeployments(): Promise<ReadDeploymentDto[]> {

    return await this.deploymentsService.getDeployments()
  }

  @Get(':id')
  public async getDeploymentById(@Param('id') id: string): Promise<ReadDeploymentDto> {
    return await this.deploymentsService.getDeploymentById(id)
  }
}
