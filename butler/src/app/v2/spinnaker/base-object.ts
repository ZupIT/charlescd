import { SpinnakerPipeline } from '../interfaces'

export const spinObject: SpinnakerPipeline = {
  application: 'app-59b0b8a9-8259-4aba-a48e-36297fc4a399',
  name: '68577698-84b7-4300-914d-2b1203955a2f',
  expectedArtifacts: [
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'template-quiz-app-frontend-default-artifact',
        name: 'template-quiz-app-frontend',
        reference: 'https://api.github.com/repos/zupit/darwin-k8s-chart-values/contents/quiz-app-frontend/quiz-app-frontend-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - quiz-app-frontend',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-quiz-app-frontend',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'value-quiz-app-frontend-default-artifact',
        name: 'value-quiz-app-frontend',
        reference: 'https://api.github.com/repos/zupit/darwin-k8s-chart-values/contents/quiz-app-frontend/quiz-app-frontend.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - quiz-app-frontend',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-quiz-app-frontend',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'template-quiz-app-backend-default-artifact',
        name: 'template-quiz-app-backend',
        reference: 'https://api.github.com/repos/zupit/darwin-k8s-chart-values/contents/quiz-app-backend/quiz-app-backend-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - quiz-app-backend',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-quiz-app-backend',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'value-quiz-app-backend-default-artifact',
        name: 'value-quiz-app-backend',
        reference: 'https://api.github.com/repos/zupit/darwin-k8s-chart-values/contents/quiz-app-backend/quiz-app-backend.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - quiz-app-backend',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-quiz-app-backend',
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
            id: 'useless - deployment - tdc-quiz-ok'
          },
          displayName: 'deployment - tdc-quiz-ok',
          id: 'deployment - tdc-quiz-ok',
          matchArtifact: {
            id: 'useless - deployment - tdc-quiz-ok - match',
            name: 'quiz-app-frontend-tdc-quiz-ok',
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
          id: 'template - quiz-app-frontend'
        },
        {
          account: 'github-artifact',
          id: 'value - quiz-app-frontend'
        }
      ],
      name: 'Bake tdc-quiz-ok frontend',
      namespace: 'sandbox',
      outputName: 'quiz-app-frontend-tdc-quiz-ok',
      overrides: {
        'image.tag': 'realwavelab.azurecr.io/quiz-app-frontend:tdc-quiz-ok',
        name: 'tdc-quiz-ok'
      },
      refId: '1',
      requisiteStageRefIds: [],
      stageEnabled: {},
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
      manifestArtifactId: 'deployment - tdc-quiz-ok',
      moniker: {
        app: 'quiz-app-frontend'
      },
      name: 'Deploy tdc-quiz-ok frontend',
      refId: '2',
      requisiteStageRefIds: [
        '1'
      ],
      skipExpressionEvaluation: false,
      source: 'artifact',
      stageEnabled: {
        expression: '${ #stage(\'Bake tdc-quiz-ok frontend\').status.toString() == \'SUCCEEDED\'}',
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
            id: 'useless - deployment - tdc-quiz-ok'
          },
          displayName: 'deployment - tdc-quiz-ok',
          id: 'deployment - tdc-quiz-ok',
          matchArtifact: {
            id: 'useless - deployment - tdc-quiz-ok - match',
            name: 'quiz-app-backend-tdc-quiz-ok',
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
          id: 'template - quiz-app-backend'
        },
        {
          account: 'github-artifact',
          id: 'value - quiz-app-backend'
        }
      ],
      name: 'Bake tdc-quiz-ok backend',
      namespace: 'sandbox',
      outputName: 'quiz-app-backend-tdc-quiz-ok',
      overrides: {
        'image.tag': 'realwavelab.azurecr.io/quiz-app-backend:tdc-quiz-ok',
        name: 'tdc-quiz-ok'
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
      manifestArtifactId: 'deployment - tdc-quiz-ok',
      moniker: {
        app: 'quiz-app-backend'
      },
      name: 'Deploy tdc-quiz-ok backend',
      refId: '4',
      requisiteStageRefIds: [
        '3'
      ],
      skipExpressionEvaluation: false,
      source: 'artifact',
      stageEnabled: {
        expression: '${ #stage(\'Bake tdc-quiz-ok backend\').status.toString() == \'SUCCEEDED\'}',
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
            name: 'quiz-app-frontend',
            namespace: 'sandbox'
          },
          spec: {
            host: 'quiz-app-frontend',
            subsets: [
              {
                labels: {
                  version: 'quiz-app-frontend-tdc-quiz-ok'
                },
                name: 'tdc-quiz-ok'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Deploy Destination Rules frontend',
      refId: '6',
      requisiteStageRefIds: [
        '11'
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
            name: 'quiz-app-frontend',
            namespace: 'sandbox'
          },
          spec: {
            hosts: [
              'quiz-app-frontend'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=d25c2286-9360-4faa-a89a-bf604f8b7dc9.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'quiz-app-frontend',
                      subset: 'tdc-quiz-ok'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
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
                        exact: 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'quiz-app-frontend',
                      subset: 'tdc-quiz-ok'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
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
      name: 'Deploy Virtual Service frontend',
      refId: '7',
      requisiteStageRefIds: [
        '6'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules frontend\').status.toString() == \'SUCCEEDED\'}',
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
            name: 'quiz-app-backend',
            namespace: 'sandbox'
          },
          spec: {
            host: 'quiz-app-backend',
            subsets: [
              {
                labels: {
                  version: 'quiz-app-backend-tdc-quiz-ok'
                },
                name: 'tdc-quiz-ok'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Deploy Destination Rules backend',
      refId: '8',
      requisiteStageRefIds: [
        '11'
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
            name: 'quiz-app-backend',
            namespace: 'sandbox'
          },
          spec: {
            hosts: [
              'quiz-app-backend'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=d25c2286-9360-4faa-a89a-bf604f8b7dc9.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'quiz-app-backend',
                      subset: 'tdc-quiz-ok'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
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
                        exact: 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'quiz-app-backend',
                      subset: 'tdc-quiz-ok'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'd25c2286-9360-4faa-a89a-bf604f8b7dc9'
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
      name: 'Deploy Virtual Service backend',
      refId: '9',
      requisiteStageRefIds: [
        '8'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules backend\').status.toString() == \'SUCCEEDED\'}',
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
      name: 'Trigger Success Webhook',
      payload: {
        status: 'SUCCEEDED'
      },
      refId: '10',
      requisiteStageRefIds: [
        '13'
      ],
      stageEnabled: {
        expression: '${ deploymentResult && proxyDeploymentsResult }',
        type: 'expression'
      },
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'http://localhost:8883/deploy/notifications/istio-deployment?queuedIstioDeploymentId=1'
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failOnFailedExpressions: true,
      failPipeline: false,
      name: 'Evaluate deployments',
      refId: '11',
      requisiteStageRefIds: [
        '2',
        '4'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'deploymentResult',
          value: '${ #stage(\'Deploy tdc-quiz-ok frontend\').status.toString() == \'SUCCEEDED\' && #stage(\'Deploy tdc-quiz-ok backend\').status.toString() == \'SUCCEEDED\' }'
        }
      ]
    },
    {
      failOnFailedExpressions: true,
      name: 'Evaluate proxy deployments',
      refId: '12',
      requisiteStageRefIds: [
        '7',
        '9'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'proxyDeploymentsResult',
          value: '${ #stage(\'Deploy Virtual Service frontend\').status.toString() == \'SUCCEEDED\' && #stage(\'Deploy Virtual Service backend\').status.toString() == \'SUCCEEDED\' }'
        }
      ]
    },
    {
      account: 'default',
      app: 'app-59b0b8a9-8259-4aba-a48e-36297fc4a399',
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
              'quiz-app-backend'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'quiz-app-backend-tdc-quiz-fail'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Unused Version',
      nameStage: 'Delete Deployments',
      options: {
        cascading: true
      },
      refId: '13',
      requisiteStageRefIds: [
        '12'
      ],
      stageEnabled: {
        expression: '${proxyDeploymentsResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
    },
    {
      account: 'default',
      app: 'app-59b0b8a9-8259-4aba-a48e-36297fc4a399',
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
              'quiz-app-backend'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'quiz-app-backend-tdc-quiz-ok'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Backend Deployment',
      options: {
        cascading: true
      },
      refId: '14',
      requisiteStageRefIds: [
        '11'
      ],
      stageEnabled: {
        expression: '${!deploymentResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
    },
    {
      account: 'default',
      app: 'app-59b0b8a9-8259-4aba-a48e-36297fc4a399',
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
              'quiz-app-frontend'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'quiz-app-frontend-tdc-quiz-ok'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Frontend Deployment',
      options: {
        cascading: true
      },
      refId: '15',
      requisiteStageRefIds: [
        '11'
      ],
      stageEnabled: {
        expression: '${!deploymentResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      method: 'POST',
      name: 'Trigger Failure Webhook',
      payload: {
        status: 'FAILURE'
      },
      refId: '16',
      requisiteStageRefIds: [
        '11',
        '12'
      ],
      stageEnabled: {
        expression: '${ !deploymentResult || !proxyDeploymentsResult }',
        type: 'expression'
      },
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'http://localhost:8883/deploy/notifications/istio-deployment?queuedIstioDeploymentId=1'
    }
  ]
}