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

import { CreateModuleDeploymentDto } from '../'
import { CreateDeploymentRequestDto } from './'
import { DeploymentEntity } from '../../entity'

export class CreateDefaultDeploymentRequestDto extends CreateDeploymentRequestDto {

  constructor(
    deploymentId: string,
    applicationName: string,
    modules: CreateModuleDeploymentDto[],
    authorId: string,
    description: string,
    callbackUrl: string,
    cdConfigurationId: string
  ) {
    super(applicationName, modules, authorId, description, callbackUrl, null, cdConfigurationId)
    this.deploymentId = deploymentId
    this.applicationName = applicationName
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.callbackUrl = callbackUrl
    this.cdConfigurationId = cdConfigurationId
  }

  public toEntity(requestCircleId: string): DeploymentEntity {
    return new DeploymentEntity(
      this.deploymentId,
      this.applicationName,
      this.modules.map(module => module.toModuleDeploymentEntity()),
      this.authorId,
      this.description,
      this.callbackUrl,
      null,
      true,
      requestCircleId,
      this.cdConfigurationId
    )
  }
}
