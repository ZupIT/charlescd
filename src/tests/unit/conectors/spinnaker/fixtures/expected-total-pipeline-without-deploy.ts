import { ConfigurationConstants, DefaultCircleId } from '../../../../../app/core/constants/application/configuration.constants'

const expectedPipelineWithoutDeployments = {
  appConfig: {},
  application: 'application-name',
  name: 'pipeline-name',
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
            subsets: []
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
              'unreachable-app-name'
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
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
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

export default expectedPipelineWithoutDeployments
