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

const expectedTotalPipeline = {
  appConfig: {},
  application: 'application-name',
  expectedArtifacts: [
    {
      defaultArtifact: {
        artifactAccount: 'github-acc',
        id: 'template-app-name-default-artifact',
        name: 'template-app-name',
        reference: 'https://api.github.com/repos/org/repo/contents/app-name/app-name-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - app-name',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-app-name',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-acc',
        id: 'value-app-name-default-artifact',
        name: 'value-app-name',
        reference: 'https://api.github.com/repos/org/repo/contents/app-name/app-name.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - app-name',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-app-name',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    }
  ],
  keepWaitingPipelines: false,
  lastModifiedBy: 'anonymous',
  limitConcurrent: true,
  name: 'pipeline-name',
  stages: [
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      expectedArtifacts: [
        {
          defaultArtifact: {
            customKind: true,
            id: 'useless - deployment - v1'
          },
          displayName: 'deployment - v1',
          id: 'deployment - v1',
          matchArtifact: {
            id: 'useless - deployment - v1 - match',
            name: 'app-name',
            type: 'embedded/base64'
          },
          useDefaultArtifact: false,
          usePriorArtifact: false
        }
      ],
      failPipeline: false,
      inputArtifacts: [
        {
          account: 'github-acc',
          id: 'template - app-name'
        },
        {
          account: 'github-acc',
          id: 'value - app-name'
        }
      ],
      name: 'Bake v1',
      namespace: 'app-namespace',
      outputName: 'app-name-v1',
      overrides: {
        'image.tag': '/v1',
        'name': 'v1'
      },
      refId: '1',
      requisiteStageRefIds: [],
      stageEnabled: {},
      templateRenderer: 'HELM2',
      type: 'bakeManifest'
    },
    {
      account: 'account',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifestArtifactAccount: 'embedded-artifact',
      manifestArtifactId: 'deployment - v1',
      moniker: {
        app: 'app-name'
      },
      name: 'Deploy v1',
      refId: '2',
      requisiteStageRefIds: [
        '1'
      ],
      skipExpressionEvaluation: false,
      source: 'artifact',
      stageEnabled: {
        expression: '${ #stage(\'Bake v1\').status.toString() == \'SUCCEEDED\'}',
        type: 'expression'
      },
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest'
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      customHeaders: {
        'x-circle-id': 'circle-id'
      },
      failPipeline: false,
      method: 'POST',
      name: 'Trigger webhook',
      payload: {
        status: '${#stage( \'Deploy v1\' ).status.toString()}',
        callbackType: 'DEPLOYMENT'
      },
      refId: '3',
      requisiteStageRefIds: [
        '2'
      ],
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'webhook.uri'
    }
  ],
  triggers: [
    {
      enabled: true,
      payloadConstraints: {},
      source: 'pipeline-name',
      type: 'webhook'
    }
  ],
  updateTs: '1573212638000'
}

export default expectedTotalPipeline
