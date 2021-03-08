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

import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { ApiProperty } from '@nestjs/swagger'
import { KubernetesManifest } from '../../../core/integrations/interfaces/k8s-manifest.interface'

export class CreateComponentRequestDto {

  @ApiProperty()
  public componentId: string

  @ApiProperty()
  public buildImageUrl: string

  @ApiProperty()
  public buildImageTag: string

  @ApiProperty()
  public componentName: string

  @ApiProperty()
  public readonly hostValue?: string | undefined

  @ApiProperty()
  public readonly gatewayName?: string | undefined

  public helmRepository : string

  constructor(
    componentId: string,
    buildImageUrl: string,
    buildImageTag: string,
    componentName: string,
    hostValue: string | undefined,
    gatewayName: string | undefined,
    helmRepository: string
  ) {
    this.componentId = componentId
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.componentName = componentName
    this.hostValue = hostValue
    this.gatewayName = gatewayName
    this.helmRepository = helmRepository
  }

  public toEntity(helmRepositoryUrl: string, manifests: KubernetesManifest[]): ComponentEntity {
    return new ComponentEntity(
      helmRepositoryUrl,
      this.buildImageTag,
      this.buildImageUrl,
      this.componentName,
      this.componentId,
      this.hostValue ? this.hostValue : null,
      this.gatewayName ? this.gatewayName : null,
      manifests
    )
  }
}
