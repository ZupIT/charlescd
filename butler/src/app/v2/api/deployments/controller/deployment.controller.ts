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

import { Body, Controller, Headers, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto';
import { DeploymentEntity } from '../entity/deployment.entity';
import { CdConfigurationExistencePipe } from '../pipes/cd-configuration-existence-pipe';
import { DeploymentUseCase } from '../use-cases/deployment-use-case';

@Controller('v2/deployments')
export class DeploymentsController {

  constructor(
      private deploymentUseCase: DeploymentUseCase
  ) { }

  @Post()
  @UsePipes(CdConfigurationExistencePipe)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createDeployment(
    @Body() createDeploymentRequestDto: CreateDeploymentRequestDto,
    @Headers('x-circle-id') incomingCircleId: string,
  ): Promise<DeploymentEntity> {
    return this.deploymentUseCase.save(createDeploymentRequestDto.toEntity())
  }
}
