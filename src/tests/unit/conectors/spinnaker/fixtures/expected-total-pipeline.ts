const expectedTotalPipeline = {
  appConfig: {},
  application: 'application-name',
  expectedArtifacts: [
    {
      defaultArtifact: {
        artifactAccount: 'github-acc',
        id: 'template-app-name-default-artifact',
        name: 'template-app-name',
        reference: 'helm-template.url',
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
        reference: 'helm-prefixapp-name.yaml',
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
      account: 'account',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            labels: {
              app: 'app-name',
              service: 'app-name'
            },
            name: 'app-name',
            namespace: 'app-namespace'
          },
          spec: {
            ports: [
              {
                name: 'http',
                port: 12345,
                targetPort: 12345
              }
            ],
            selector: {
              app: 'app-name'
            }
          }
        }
      ],
      moniker: {
        app: 'account'
      },
      name: 'Deploy Service',
      refId: '1',
      requisiteStageRefIds: [],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {},
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
      refId: '2',
      requisiteStageRefIds: [
        '1'
      ],
      stageEnabled: {
        expression: '${ #stage(\'Deploy Service\').status.toString() == \'SUCCEEDED\'}',
        type: 'expression'
      },
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
      refId: '3',
      requisiteStageRefIds: [
        '2'
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
      refId: '4',
      requisiteStageRefIds: [
        '3'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy v1\').status.toString() == \'SUCCEEDED\'}',
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
      refId: '5',
      requisiteStageRefIds: [
        '4'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Deploy Destination Rules\').status.toString() == \'SUCCEEDED\'}',
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
      refId: '6',
      requisiteStageRefIds: [
        '5'
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
      refId: '7',
      requisiteStageRefIds: [
        '6'
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
