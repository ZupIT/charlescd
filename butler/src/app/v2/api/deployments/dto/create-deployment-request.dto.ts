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

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { CdConfigurationEntity } from '../../configurations/entity/cd-configuration.entity'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { CreateCircleDeploymentDto } from './create-circle-request.dto'
import { CreateModuleDeploymentDto } from './create-module-request.dto'

export class CreateDeploymentRequestDto {

  @ApiProperty()
  public deploymentId: string

  @ApiProperty()
  public authorId: string

  @ApiProperty()
  public callbackUrl: string

  @ApiProperty()
  public cdConfigurationId: string

  public cdConfiguration!: CdConfigurationEntity

  @ApiProperty({ type: () => CreateCircleDeploymentDto })
  @Type(() => CreateCircleDeploymentDto)
  public circle: CreateCircleDeploymentDto

  public status: DeploymentStatusEnum

  @ApiProperty()
  public defaultCircle: boolean

  @ApiProperty({ type: () => [CreateModuleDeploymentDto] })
  @Type(() => CreateModuleDeploymentDto)
  public readonly modules: CreateModuleDeploymentDto[]

  constructor(
    deploymentId: string,
    authorId: string,
    callbackUrl: string,
    cdConfigurationId: string,
    circle: CreateCircleDeploymentDto,
    status: DeploymentStatusEnum,
    modules: CreateModuleDeploymentDto[],
    defaultCircle: boolean
  ) {
    this.deploymentId = deploymentId
    this.authorId = authorId
    this.callbackUrl = callbackUrl
    this.cdConfigurationId = cdConfigurationId
    this.circle = circle
    this.status = status
    this.modules = modules
    this.defaultCircle = defaultCircle
  }

  public toCircleEntity(newComponents: ComponentEntity[]): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle.headerValue,
      this.cdConfiguration,
      this.callbackUrl,
      newComponents,
      this.defaultCircle
    )
  }

  public toDefaultEntity(activeComponents: ComponentEntity[], newComponents: ComponentEntity[]): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle.headerValue,
      this.cdConfiguration,
      this.callbackUrl,
      [ ...activeComponents, ...newComponents],
      this.defaultCircle
    )
  }
}
