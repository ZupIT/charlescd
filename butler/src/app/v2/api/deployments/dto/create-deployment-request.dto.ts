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
import { IsNotEmpty, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator'
import { flatten } from 'lodash'
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { CreateCircleDeploymentDto } from './create-circle-request.dto'
import { CreateModuleDeploymentDto } from './create-module-request.dto'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'

export class CreateDeploymentRequestDto {

  @IsUUID()
  @IsNotEmpty()
  public deploymentId: string

  @IsUUID()
  @IsNotEmpty()
  public authorId: string

  @IsString()
  @IsNotEmpty()
  public callbackUrl: string

  @IsUUID()
  @IsNotEmpty()
  public cdConfigurationId: string

  public cdConfiguration!: CdConfigurationEntity

  @ValidateIf((obj, value) => { return value })
  @ValidateNested({ each: true })
  @Type(() => CreateCircleDeploymentDto)
  public circle: CreateCircleDeploymentDto | null

  public status: DeploymentStatusEnum

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
    modules: CreateModuleDeploymentDto[]
  ) {
    this.deploymentId = deploymentId
    this.authorId = authorId
    this.callbackUrl = callbackUrl
    this.cdConfigurationId = cdConfigurationId
    this.circle = circle
    this.status = status
    this.modules = modules
  }

  public toCircleEntity(): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle ? this.circle.headerValue : null,
      this.cdConfiguration,
      this.callbackUrl,
      this.getDeploymentComponents()
    )
  }

  public toDefaultEntity(activeComponents: ComponentEntity[]): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      null,
      this.cdConfiguration,
      this.callbackUrl,
      [ ...activeComponents, ...this.getDeploymentComponents()]
    )
  }

  private getDeploymentComponents(): ComponentEntity[] {
    return flatten(
      this.modules.map(module => module.components.map(component => component.toEntity(module.helmRepository)))
    )
  }
}
