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

import { QueuedPipelineStatusEnum } from '../../enums'

export class ReadQueuedIstioDeploymentDto {

  public readonly id: number

  public readonly deploymentId: string

  public readonly componentId: string

  public readonly componentDeploymentId: string

  public readonly status: QueuedPipelineStatusEnum

  public readonly createdAt: Date

  constructor(
    id: number,
    deploymentId: string,
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    createdAt: Date
  ) {
    this.id = id
    this.deploymentId = deploymentId
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId,
    this.status = status
    this.createdAt = createdAt
  }
}
