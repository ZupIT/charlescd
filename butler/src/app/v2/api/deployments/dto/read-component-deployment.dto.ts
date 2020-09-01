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

export class ReadComponentDeploymentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly componentName: string

  public readonly buildImageUrl: string

  public readonly buildImageTag: string

  public readonly createdAt: Date

  public readonly hostValue: string | null

  public readonly gatewayName: string | null

  constructor(
    id: string,
    componentId: string,
    componentName: string,
    buildImageUrl: string,
    buildImageTag: string,
    hostValue: string | null,
    gatewayName: string | null,
    createdAt: Date
  ) {
    this.id = id
    this.componentId = componentId
    this.componentName = componentName
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.hostValue = hostValue
    this.gatewayName = gatewayName
    this.createdAt = createdAt
  }
}
