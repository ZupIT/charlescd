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

import 'jest'
import TotalPipeline from '../../../../app/core/integrations/cd/spinnaker/connector'
import expectedTotalPipeline from './fixtures/expected-total-pipeline'
import { ISpinnakerPipelineConfiguration } from '../../../../app/core/integrations/cd/spinnaker/interfaces'
import expectedPipelineWithoutDeployments from './fixtures/expected-total-pipeline-without-deploy'
import istioPipeline from './fixtures/expected-istio-pipeline'

it('compiles the pipeline', () => {
  const contract: ISpinnakerPipelineConfiguration = {
    account: 'account',
    pipelineName: 'pipeline-name',
    applicationName: 'application-name',
    appName: 'app-name',
    appNamespace: 'app-namespace',
    webhookUri: 'webhook.uri',
    versions: [{ version: 'v1', versionUrl: '/v1' }],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }],
    githubAccount: 'github-acc',
    helmRepository: 'https://api.github.com/repos/org/repo/contents/',
    circleId: 'circle-id',
    url: 'http://spinnaker.url.com'
  }

  const totalPipeline = new TotalPipeline(contract)
  expect(totalPipeline.buildPipeline()).toEqual(expectedTotalPipeline)
})

it('compiles the pipeline with only undeployment', () => {
  const contract: ISpinnakerPipelineConfiguration = {
    account: 'account',
    pipelineName: 'pipeline-name',
    applicationName: 'application-name',
    appName: 'app-name',
    appNamespace: 'app-namespace',
    webhookUri: 'webhook.uri',
    versions: [],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }],
    githubAccount: 'github-acc',
    helmRepository: 'https://api.github.com/repos/org/repo/contents/',
    circleId: 'circle-id',
    url: 'http://spinnaker.url.com'
  }
  const totalPipeline = new TotalPipeline(contract)
  const result = totalPipeline.buildPipeline()

  expect(result).toEqual(expectedPipelineWithoutDeployments)
})

it('builds istio pipeline', () => {
    const contract: ISpinnakerPipelineConfiguration = {
    account: 'account',
    pipelineName: 'pipeline-name',
    applicationName: 'application-name',
    appName: 'app-name',
    appNamespace: 'app-namespace',
    webhookUri: 'webhook.uri',
    versions: [{ version: 'v1', versionUrl: '/v1' }],
    unusedVersions: [{ version: 'v2', versionUrl: '/v2' }],
    circles: [{ destination: { version: 'v3' } }, { destination: { version: 'v4' } }],
    githubAccount: 'github-acc',
    helmRepository: 'https://api.github.com/repos/org/repo/contents/',
    circleId: 'circle-id',
    url: 'http://spinnaker.url.com'
  }
    const totalPipeline = new TotalPipeline(contract)
    const result = totalPipeline.buildIstioPipeline()
    expect(result).toEqual(istioPipeline)
})
