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

const istioPipeline = {
  appConfig: {},
  application: 'application-name',
  name: 'pipeline-name',
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
  stages: [
    {
      stageEnabled: {
        expression: '',
        type: 'expression'
      },
      account: 'account',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'DestinationRule',
          metadata: {
            name: 'app-name',
            namespace: 'app-namespace'
          },
          spec: {
            host: 'app-name',
            subsets: [
              {
                labels: {
                  version: 'app-name-v1'
                },
                name: 'v1'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'account'
      },
      name: 'Deploy Destination Rules',
      skipExpressionEvaluation: false,
      source: 'text',
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest',
      refId: '1',
      requisiteStageRefIds: []
    },
    {
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules\').status.toString() == \'SUCCEEDED\'}',
        type: 'expression'
      },
      account: 'account',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: 'app-name',
            namespace: 'app-namespace'
          },
          spec: {
            hosts: [
              'app-name'
            ],
            http: [
              {
                route: [
                  {
                    destination: {
                      host: 'app-name',
                      subset: 'v3'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'f5d23a57-5607-4306-9993-477e1598cc2a'
                        }
                      }
                    }
                  }
                ]
              },
              {
                route: [
                  {
                    destination: {
                      host: 'app-name',
                      subset: 'v4'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'f5d23a57-5607-4306-9993-477e1598cc2a'
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'account'
      },
      name: 'Deploy Virtual Service',
      skipExpressionEvaluation: false,
      source: 'text',
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest',
      refId: '2',
      requisiteStageRefIds: [
        '1'
      ]
    },
    {
      account: 'account',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      kinds: [
        'deployment'
      ],
      labelSelectors: {
        selectors: [
          {
            key: 'app',
            kind: 'EQUALS',
            values: [
              'app-name'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'app-name-v2'
            ]
          }
        ]
      },
      location: 'app-namespace',
      mode: 'label',
      name: 'Delete Deployments',
      nameStage: 'Delete Deployments',
      options: {
        cascading: true,
        gracePeriodSeconds: null
      },
      refId: '3',
      requisiteStageRefIds: [
        '2'
      ],
      stageEnabled: {
        expression: '${ #stage(\'Deploy Virtual Service\').status.toString() == \'SUCCEEDED\'}',
        type: 'expression'
      },
      type: 'deleteManifest'
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
        status: '${#stage( \'Delete Deployments\' ).status.toString()}'
      },
      refId: '4',
      requisiteStageRefIds: [
        '3'
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

export default istioPipeline
