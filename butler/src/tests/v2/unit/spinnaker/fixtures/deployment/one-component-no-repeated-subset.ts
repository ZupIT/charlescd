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

import { SpinnakerPipeline } from '../../../../../../app/v2/core/integrations/spinnaker/interfaces'
import { AppConstants } from '../../../../../../app/v1/core/constants'
import { DeploymentStatusEnum } from '../../../../../../app/v1/api/deployments/enums'
import { ExecutionTypeEnum } from '../../../../../../app/v2/api/deployments/enums'

export const oneComponentNoRepeatedSubset: SpinnakerPipeline = {
  application: 'app-cd-configuration-id',
  name: 'deployment-id',
  expectedArtifacts: [
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'template-A-default-artifact',
        name: 'template-A',
        reference: 'http://localhost:2222/helm/A/A-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - A',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-A',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'value-A-default-artifact',
        name: 'value-A',
        reference: 'http://localhost:2222/helm/A/A.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - A',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-A',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    }
  ],
  stages: [
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      expectedArtifacts: [
        {
          defaultArtifact: {
            customKind: true,
            id: 'useless - deployment - v2'
          },
          displayName: 'deployment - v2',
          id: 'deployment - v2',
          matchArtifact: {
            id: 'useless - deployment - v2 - match',
            name: 'A-v2',
            type: 'embedded/base64'
          },
          useDefaultArtifact: false,
          usePriorArtifact: false
        }
      ],
      failPipeline: false,
      inputArtifacts: [
        {
          account: 'github-artifact',
          id: 'template - A'
        },
        {
          account: 'github-artifact',
          id: 'value - A'
        }
      ],
      name: 'Bake A v2',
      namespace: 'sandbox',
      outputName: 'A-v2',
      overrides: {
        'image.tag': 'https://repository.com/A:v2',
        name: 'v2',
        circleId: 'circle-id2'
      },
      refId: '1',
      requisiteStageRefIds: [],
      stageEnabled: {
        type: 'expression'
      },
      templateRenderer: 'HELM2',
      type: 'bakeManifest'
    },
    {
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifestArtifactAccount: 'embedded-artifact',
      manifestArtifactId: 'deployment - v2',
      moniker: {
        app: 'default'
      },
      name: 'Deploy A v2',
      refId: '2',
      requisiteStageRefIds: [
        '1'
      ],
      skipExpressionEvaluation: false,
      source: 'artifact',
      stageEnabled: {
        expression: '${ #stage(\'Bake A v2\').status.toString() == \'SUCCEEDED\'}',
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
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'DestinationRule',
          metadata: {
            name: 'A',
            namespace: 'sandbox'
          },
          spec: {
            host: 'A',
            subsets: [
              {
                labels: {
                  version: 'A-v2'
                },
                name: 'v2'
              },
              {
                labels: {
                  version: 'A-v0'
                },
                name: 'v0'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Deploy Destination Rules A',
      refId: '3',
      requisiteStageRefIds: [
        '5'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${deploymentResult}',
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
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: 'A',
            namespace: 'sandbox'
          },
          spec: {
            gateways: [],
            hosts: [
              'A'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id2.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v2'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      'x-circle-id': {
                        exact: 'circle-id2'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v2'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id3.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      'x-circle-id': {
                        exact: 'circle-id3'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id5.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id5'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id5'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      'x-circle-id': {
                        exact: 'circle-id5'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id5'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id5'
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
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
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
        app: 'default'
      },
      name: 'Deploy Virtual Service A',
      refId: '4',
      requisiteStageRefIds: [
        '3'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules A\').status.toString() == \'SUCCEEDED\'}',
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
      failOnFailedExpressions: true,
      failPipeline: false,
      name: 'Evaluate deployments',
      refId: '5',
      requisiteStageRefIds: [
        '2'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'deploymentResult',
          value: '${#stage(\'Deploy A v2\').status.toString() == \'SUCCEEDED\'}'
        }
      ]
    },
    {
      failOnFailedExpressions: true,
      name: 'Evaluate proxy deployments',
      refId: '6',
      requisiteStageRefIds: [
        '4'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'proxyDeploymentsResult',
          value: '${#stage(\'Deploy Virtual Service A\').status.toString() == \'SUCCEEDED\'}'
        }
      ]
    },
    {
      account: 'default',
      app: 'app-cd-configuration-id',
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
              'A'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'A-v2'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Deployment A v2',
      options: {
        cascading: true
      },
      refId: '7',
      requisiteStageRefIds: [
        '5'
      ],
      stageEnabled: {
        expression: '${!deploymentResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
    },
    {
      account: 'default',
      app: 'app-cd-configuration-id',
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
              'A'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'A-v1'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Unused Deployment A v1',
      nameStage: 'Delete Deployments',
      options: {
        cascading: true
      },
      refId: '8',
      requisiteStageRefIds: [
        '6'
      ],
      stageEnabled: {
        expression: '${proxyDeploymentsResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      customHeaders: {
        'x-circle-id': 'Default'
      },
      failPipeline: false,
      method: 'POST',
      name: 'Trigger Failure Webhook',
      payload: {
        status: DeploymentStatusEnum.FAILED,
        type: ExecutionTypeEnum.DEPLOYMENT
      },
      refId: '9',
      requisiteStageRefIds: [
        '5',
        '6'
      ],
      stageEnabled: {
        expression: '${ !deploymentResult || !proxyDeploymentsResult }',
        type: 'expression'
      },
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'http://localhost:8883/butler/v2/executions/execution-id/notify'
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      customHeaders: {
        'x-circle-id': 'Default'
      },
      failPipeline: false,
      method: 'POST',
      name: 'Trigger Success Webhook',
      payload: {
        status: DeploymentStatusEnum.SUCCEEDED,
        type: ExecutionTypeEnum.DEPLOYMENT
      },
      refId: '10',
      requisiteStageRefIds: [
        '5',
        '6'
      ],
      stageEnabled: {
        expression: '${ deploymentResult && proxyDeploymentsResult }',
        type: 'expression'
      },
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'http://localhost:8883/butler/v2/executions/execution-id/notify'
    }
  ]
}
