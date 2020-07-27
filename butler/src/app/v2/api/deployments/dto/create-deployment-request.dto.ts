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

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { flatten } from 'lodash';
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity';
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums';
import { DeploymentEntity } from '../entity/deployment.entity';
import { CreateCircleDeploymentDto } from './create-circle-request.dto';
import { CreateModuleDeploymentDto } from './create-module-request.dto';

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

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCircleDeploymentDto)
  public readonly circle: CreateCircleDeploymentDto

  public status: DeploymentStatusEnum

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDeploymentDto)
  public readonly modules: CreateModuleDeploymentDto[]

  constructor(deploymentId: string,
    authorId: string, callbackUrl: string,
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

  public toEntity(): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      DeploymentStatusEnum.CREATED,
      this.circle.headerValue,
      this.cdConfiguration,
      this.callbackUrl,
      flatten(this.modules.map(m => m.toEntity()))
    )
  }
}
