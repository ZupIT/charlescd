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

import { ReadModuleDeploymentDto } from './read-module-deployment.dto'
import { ReadCircleDeploymentDto } from './read-circle-deployment.dto'

export class ReadDeploymentDto {

  public readonly id: string

  public readonly applicationName: string

  public readonly modulesDeployments: ReadModuleDeploymentDto[]

  public readonly authorId: string

  public readonly description: string

  public readonly circle: ReadCircleDeploymentDto | undefined

  public readonly callbackUrl: string

  public readonly defaultCircle: boolean

  public readonly createdAt: Date

  constructor(
    id: string,
    applicationName: string,
    modulesDeployments: ReadModuleDeploymentDto[],
    authorId: string,
    description: string,
    callbackUrl: string,
    defaultCircle: boolean,
    createdAt: Date,
    circle?: ReadCircleDeploymentDto
  ) {
    this.id = id
    this.applicationName = applicationName
    this.modulesDeployments = modulesDeployments
    this.authorId = authorId
    this.description = description
    this.circle = circle
    this.callbackUrl = callbackUrl
    this.defaultCircle = defaultCircle
    this.createdAt = createdAt
  }
}
