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

import { UndeploymentStatusEnum } from '../../enums'
import { ReadModuleUndeploymentDto } from './read-module-undeployment.dto'

export class ReadUndeploymentDto {

  public readonly id: string

  public readonly authorId: string

  public readonly createdAt: Date

  public readonly deployment: string

  public readonly status: UndeploymentStatusEnum

  public readonly circleId: string

  public readonly modulesUndeployments: ReadModuleUndeploymentDto[] | null | undefined

  constructor(
    id: string,
    authorId: string,
    createdAt: Date,
    deployment: string,
    status: UndeploymentStatusEnum,
    circleId: string,
    modulesUndeployments: ReadModuleUndeploymentDto[] | null | undefined
  ) {
    this.id = id
    this.authorId = authorId
    this.createdAt = createdAt
    this.deployment = deployment
    this.status = status
    this.circleId = circleId
    this.modulesUndeployments = modulesUndeployments
  }
}
