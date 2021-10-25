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
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { CreateCircleDeploymentDto } from './create-circle-request.dto'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { Metadata } from '../interfaces/deployment.interface'
import { CreateGitDeploymentDto } from './create-git-request.dto'
import { CreateComponentRequestDto } from './create-component-request.dto'



export class CreateDeploymentRequestDto {

  @ApiProperty()
  public deploymentId: string

  @ApiProperty()
  public authorId: string

  @ApiProperty()
  public callbackUrl: string

  @ApiProperty()
  @Type(() => CreateCircleDeploymentDto)
  public circle: CreateCircleDeploymentDto

  @ApiProperty()
  @Type(() => CreateGitDeploymentDto)
  public git: CreateGitDeploymentDto

  @ApiProperty()
  public namespace: string

  @ApiProperty()
  public timeoutInSeconds: number

  public status: DeploymentStatusEnum

  @ApiProperty({ type: () => [CreateComponentRequestDto] })
  @Type(() => CreateComponentRequestDto)
  public readonly components: CreateComponentRequestDto[]

  @ApiProperty()
  public metadata: Metadata | null

  constructor(
    deploymentId: string,
    authorId: string,
    callbackUrl: string,
    circle: CreateCircleDeploymentDto,
    status: DeploymentStatusEnum,
    components: CreateComponentRequestDto[],
    namespace: string,
    git: CreateGitDeploymentDto,
    timeoutInSeconds: number,
    metadata: Metadata | null
  ) {
    this.deploymentId = deploymentId
    this.authorId = authorId
    this.callbackUrl = callbackUrl
    this.circle = circle
    this.status = status
    this.components = components
    this.namespace = namespace
    this.git = git
    this.timeoutInSeconds = timeoutInSeconds
    this.metadata = metadata
  }

  public toCircleEntity(newComponents: ComponentEntity[]): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle.id,
      this.callbackUrl,
      newComponents,
      this.circle.default,
      this.namespace,
      this.timeoutInSeconds,
      this.metadata
    )
  }

  public toDefaultEntity(activeComponents: ComponentEntity[], newComponents: ComponentEntity[]): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.authorId,
      this.circle.id,
      this.callbackUrl,
      [ ...activeComponents, ...newComponents],
      this.circle.default,
      this.namespace,
      this.timeoutInSeconds,
      this.metadata
    )
  }

}
