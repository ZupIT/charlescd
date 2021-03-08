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

import { ExecutionTypeEnum } from '../../../../../../app/v2/api/deployments/enums'
import { DeploymentStatusEnum } from '../../../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { SpinnakerPipeline } from '../../../../../../app/v2/core/integrations/spinnaker/interfaces/spinnaker-pipeline.interface'

export const completeWithOverridesAndDeleteProxyForCircle : SpinnakerPipeline = {
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
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'template-B-default-artifact',
        name: 'template-B',
        reference: 'http://localhost:2222/helm/B/B-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - B',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-B',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'value-B-default-artifact',
        name: 'value-B',
        reference: 'http://localhost:2222/helm/B/B.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - B',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-B',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'template-D-default-artifact',
        name: 'template-D',
        reference: 'http://localhost:2222/helm/D/D-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - D',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-D',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'value-D-default-artifact',
        name: 'value-D',
        reference: 'http://localhost:2222/helm/D/D.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - D',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-D',
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
        deploymentName: 'A-v2-circle-id',
        component: 'A',
        tag: 'v2',
        circleId: 'circle-id'
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
            name: 'B-v2',
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
          id: 'template - B'
        },
        {
          account: 'github-artifact',
          id: 'value - B'
        }
      ],
      name: 'Bake B v2',
      namespace: 'sandbox',
      outputName: 'B-v2',
      overrides: {
        'image.tag': 'https://repository.com/B:v2',
        deploymentName: 'B-v2-circle-id',
        component: 'B',
        tag: 'v2',
        circleId: 'circle-id'
      },
      refId: '3',
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
      name: 'Deploy B v2',
      refId: '4',
      requisiteStageRefIds: [
        '3'
      ],
      skipExpressionEvaluation: false,
      source: 'artifact',
      stageEnabled: {
        expression: '${ #stage(\'Bake B v2\').status.toString() == \'SUCCEEDED\'}',
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
            name: 'D-v2',
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
          id: 'template - D'
        },
        {
          account: 'github-artifact',
          id: 'value - D'
        }
      ],
      name: 'Bake D v2',
      namespace: 'sandbox',
      outputName: 'D-v2',
      overrides: {
        'image.tag': 'https://repository.com/D:v2',
        deploymentName: 'D-v2-circle-id',
        component: 'D',
        tag: 'v2',
        circleId: 'circle-id'
      },
      refId: '5',
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
      name: 'Deploy D v2',
      refId: '6',
      requisiteStageRefIds: [
        '5'
      ],
      skipExpressionEvaluation: false,
      source: 'artifact',
      stageEnabled: {
        expression: '${ #stage(\'Bake D v2\').status.toString() == \'SUCCEEDED\'}',
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
                  component: 'A',
                  tag: 'v2',
                  circleId: 'circle-id'
                },
                name: 'circle-id'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Deploy Destination Rules A',
      refId: '7',
      requisiteStageRefIds: [
        '13'
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
                        regex: '.*x-circle-id=circle-id.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'circle-id'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id'
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
                        exact: 'circle-id'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'circle-id'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id'
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
      refId: '8',
      requisiteStageRefIds: [
        '7'
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
            name: 'B',
            namespace: 'sandbox'
          },
          spec: {
            host: 'B',
            subsets: [
              {
                labels: {
                  component: 'B',
                  tag: 'v2',
                  circleId: 'circle-id'
                },
                name: 'circle-id'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Deploy Destination Rules B',
      refId: '9',
      requisiteStageRefIds: [
        '13'
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
            name: 'B',
            namespace: 'sandbox'
          },
          spec: {
            gateways: [],
            hosts: [
              'B'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'B',
                      subset: 'circle-id'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id'
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
                        exact: 'circle-id'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'B',
                      subset: 'circle-id'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id'
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
      name: 'Deploy Virtual Service B',
      refId: '10',
      requisiteStageRefIds: [
        '9'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules B\').status.toString() == \'SUCCEEDED\'}',
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
            name: 'D',
            namespace: 'sandbox'
          },
          spec: {
            host: 'D',
            subsets: [
              {
                labels: {
                  component: 'D',
                  tag: 'v2',
                  circleId: 'circle-id'
                },
                name: 'circle-id'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Deploy Destination Rules D',
      refId: '11',
      requisiteStageRefIds: [
        '13'
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
            name: 'D',
            namespace: 'sandbox'
          },
          spec: {
            gateways: [],
            hosts: [
              'D'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'D',
                      subset: 'circle-id'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id'
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
                        exact: 'circle-id'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'D',
                      subset: 'circle-id'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id'
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
      name: 'Deploy Virtual Service D',
      refId: '12',
      requisiteStageRefIds: [
        '11'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules D\').status.toString() == \'SUCCEEDED\'}',
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
      refId: '13',
      requisiteStageRefIds: [
        '2',
        '4',
        '6'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'deploymentResult',
          value: '${#stage(\'Deploy A v2\').status.toString() == \'SUCCEEDED\' && #stage(\'Deploy B v2\').status.toString() == \'SUCCEEDED\' && #stage(\'Deploy D v2\').status.toString() == \'SUCCEEDED\'}'
        }
      ]
    },
    {
      failOnFailedExpressions: true,
      name: 'Evaluate proxy deployments',
      refId: '14',
      requisiteStageRefIds: [
        '8',
        '10',
        '12'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'proxyDeploymentsResult',
          value: '${#stage(\'Deploy Virtual Service A\').status.toString() == \'SUCCEEDED\' && #stage(\'Deploy Virtual Service B\').status.toString() == \'SUCCEEDED\' && #stage(\'Deploy Virtual Service D\').status.toString() == \'SUCCEEDED\'}'
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
            key: 'component',
            kind: 'EQUALS',
            values: [
              'A'
            ]
          },
          {
            key: 'tag',
            kind: 'EQUALS',
            values: [
              'v2'
            ]
          },
          {
            key: 'circleId',
            kind: 'EQUALS',
            values: [
              'circle-id'
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
      refId: '15',
      requisiteStageRefIds: [
        '13'
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
            key: 'component',
            kind: 'EQUALS',
            values: [
              'B'
            ]
          },
          {
            key: 'tag',
            kind: 'EQUALS',
            values: [
              'v2'
            ]
          },
          {
            key: 'circleId',
            kind: 'EQUALS',
            values: [
              'circle-id'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Deployment B v2',
      options: {
        cascading: true
      },
      refId: '16',
      requisiteStageRefIds: [
        '13'
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
            key: 'component',
            kind: 'EQUALS',
            values: [
              'D'
            ]
          },
          {
            key: 'tag',
            kind: 'EQUALS',
            values: [
              'v2'
            ]
          },
          {
            key: 'circleId',
            kind: 'EQUALS',
            values: [
              'circle-id'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Deployment D v2',
      options: {
        cascading: true
      },
      refId: '17',
      requisiteStageRefIds: [
        '13'
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
            key: 'component',
            kind: 'EQUALS',
            values: [
              'A'
            ]
          },
          {
            key: 'tag',
            kind: 'EQUALS',
            values: [
              'v1'
            ]
          },
          {
            key: 'circleId',
            kind: 'EQUALS',
            values: [
              'circle-id'
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
      refId: '18',
      requisiteStageRefIds: [
        '14'
      ],
      stageEnabled: {
        expression: '${proxyDeploymentsResult}',
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
            key: 'component',
            kind: 'EQUALS',
            values: [
              'B'
            ]
          },
          {
            key: 'tag',
            kind: 'EQUALS',
            values: [
              'v1'
            ]
          },
          {
            key: 'circleId',
            kind: 'EQUALS',
            values: [
              'circle-id'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Unused Deployment B v1',
      nameStage: 'Delete Deployments',
      options: {
        cascading: true
      },
      refId: '19',
      requisiteStageRefIds: [
        '14'
      ],
      stageEnabled: {
        expression: '${proxyDeploymentsResult}',
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
            key: 'component',
            kind: 'EQUALS',
            values: [
              'C'
            ]
          },
          {
            key: 'tag',
            kind: 'EQUALS',
            values: [
              'v2'
            ]
          },
          {
            key: 'circleId',
            kind: 'EQUALS',
            values: [
              'circle-id'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Unused Deployment C v2',
      nameStage: 'Delete Deployments',
      options: {
        cascading: true
      },
      refId: '20',
      requisiteStageRefIds: [
        '14'
      ],
      stageEnabled: {
        expression: '${proxyDeploymentsResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
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
            name: 'C',
            namespace: 'sandbox'
          },
          spec: {
            host: 'C',
            subsets: []
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Undeploy Destination Rules C',
      refId: '21',
      requisiteStageRefIds: [
        '14'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
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
            name: 'C',
            namespace: 'sandbox'
          },
          spec: {
            gateways: [],
            hosts: [
              'C'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      'unreachable-cookie-name': {
                        exact: 'unreachable-cookie - value'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'unreachable-app-name'
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
      name: 'Undeploy Virtual Service C',
      refId: '22',
      requisiteStageRefIds: [
        '21'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Undeploy Destination Rules C\').status.toString() == \'SUCCEEDED\'}',
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
        'x-circle-id': 'Default'
      },
      failPipeline: false,
      method: 'POST',
      name: 'Trigger Failure Webhook',
      payload: {
        status: DeploymentStatusEnum.FAILED,
        type: ExecutionTypeEnum.DEPLOYMENT
      },
      refId: '23',
      requisiteStageRefIds: [
        '13',
        '14'
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
      refId: '24',
      requisiteStageRefIds: [
        '13',
        '14'
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
