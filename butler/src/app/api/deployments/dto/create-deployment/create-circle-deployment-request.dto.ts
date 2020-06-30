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
  CreateCircleDeploymentDto,
  CreateModuleDeploymentDto
} from '../'
import {
  CreateDeploymentRequestDto
} from './'
import { DeploymentEntity } from '../../entity'
import {
  IsDefined,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCircleDeploymentRequestDto extends CreateDeploymentRequestDto {
    @ApiProperty({ type: () => CreateCircleDeploymentDto })
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => CreateCircleDeploymentDto)
    public readonly circle: CreateCircleDeploymentDto

    constructor(
      deploymentId: string,
      applicationName: string,
      modules: CreateModuleDeploymentDto[],
      authorId: string,
      description: string,
      callbackUrl: string,
      circle: CreateCircleDeploymentDto,
      cdConfigurationId: string
    ) {
      super()
      this.deploymentId = deploymentId
      this.applicationName = applicationName
      this.modules = modules
      this.authorId = authorId
      this.description = description
      this.callbackUrl = callbackUrl
      this.circle = circle
      this.cdConfigurationId = cdConfigurationId
    }

    public toEntity(requestCircleId: string): DeploymentEntity {
      return new DeploymentEntity(
        this.deploymentId,
        this.applicationName,
        this.modules.map(module => module.toModuleDeploymentEntity()),
        this.authorId,
        this.description,
        this.callbackUrl,
        this.circle.toEntity(),
        false,
        requestCircleId,
        this.cdConfigurationId
      )
    }
}
