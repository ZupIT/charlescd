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

import {
  IDeploymentVersion,
  IPipelineCircle
} from '../../../../../api/components/interfaces'

export interface ISpinnakerPipelineConfiguration {

  account: string,

  pipelineName: string,

  applicationName: string,

  appName: string,

  appNamespace: string,

  webhookUri: string,

  versions: IDeploymentVersion[],

  unusedVersions: IDeploymentVersion[],

  circles: IPipelineCircle[]

  circleId: string

  githubAccount: string

  helmRepository: string

  gatewayName?: string

  hostValue?: string

  hosts?: string[]

  url: string

  callbackType: string

}
