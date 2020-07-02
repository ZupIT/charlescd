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

import buildExpectedArtifacts from './helpers/build-expected-artifacts'
import helmValues, { HelmTypes } from './helpers/constants'
import { IBaseSpinnakerPipeline } from '../interfaces'

interface AppConfig {
  appName: string
  pipelineName: string
  applicationName: string
}

const baseSpinnaker = (
  { appName, pipelineName, applicationName }: AppConfig,
  helmRepository: string, githubAccount: string): IBaseSpinnakerPipeline => ({
  appConfig: {},
  application: applicationName,
  name: pipelineName,
  expectedArtifacts: helmValues.map(helmType => buildExpectedArtifacts(helmRepository, githubAccount, appName, helmType as HelmTypes)),
  keepWaitingPipelines: false,
  lastModifiedBy: 'anonymous',
  limitConcurrent: true,
  stages: [],
  triggers: [
    {
      enabled: true,
      payloadConstraints: {},
      source: pipelineName,
      type: 'webhook'
    }
  ],
  updateTs: '1573212638000'
})

export default baseSpinnaker
