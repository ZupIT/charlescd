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

import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator'
import { flatten } from 'lodash'
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { CreateCircleDeploymentDto } from './create-circle-request.dto'
import { CreateModuleDeploymentDto } from './create-module-request.dto'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDeploymentRequestDto {

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public deploymentId: string

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public authorId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public callbackUrl: string

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public cdConfigurationId: string

  public cdConfiguration!: CdConfigurationEntity

  @ApiProperty({ type: () => CreateCircleDeploymentDto })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateCircleDeploymentDto)
  public circle: CreateCircleDeploymentDto

  public status: DeploymentStatusEnum

  public defaultCircle: boolean

  @ApiProperty({ type: () => [CreateModuleDeploymentDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
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

  public toCircleEntity(): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle.headerValue,
      this.cdConfiguration,
      this.callbackUrl,
      this.getDeploymentComponents(),
      this.defaultCircle
    )
  }

  public toDefaultEntity(activeComponents: ComponentEntity[]): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle.headerValue,
      this.cdConfiguration,
      this.callbackUrl,
      [ ...activeComponents, ...this.getDeploymentComponents()],
      this.defaultCircle
    )
  }

  private getDeploymentComponents(): ComponentEntity[] {
    return flatten(
      this.modules.map(module => module.components.map(component => component.toEntity(module.helmRepository)))
    )
  }
}
