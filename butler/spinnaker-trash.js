const spinnakerObject = {
  appConfig: {},
  application: 'app-0fff3802-aa5d-41cf-a3f6-c05a8d4a0ed5',
  name: 'component-id-1',
  expectedArtifacts: [
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'template-component-name-default-artifact',
        name: 'template-component-name',
        reference: 'https://some-helm.repocomponent-name/component-name-darwin.tgz',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'template',
      id: 'template - component-name',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-template',
        name: 'template-component-name',
        type: 'github/file'
      },
      useDefaultArtifact: true,
      usePriorArtifact: false
    },
    {
      defaultArtifact: {
        artifactAccount: 'github-artifact',
        id: 'value-component-name-default-artifact',
        name: 'value-component-name',
        reference: 'https://some-helm.repocomponent-name/component-name.yaml',
        type: 'github/file',
        version: 'master'
      },
      displayName: 'value',
      id: 'value - component-name',
      matchArtifact: {
        artifactAccount: 'github-artifact',
        id: 'useless-value',
        name: 'value-component-name',
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
  
  ],
  triggers: [
    {
      enabled: true,
      payloadConstraints: {},
      source: 'component-id-1',
      type: 'webhook'
    }
  ],
  updateTs: '1573212638000',
  id: '486b0b26-b2fd-43d0-bdd0-df126e314c70'
}
  
const getBakeStage = index => ({
  stageEnabled: {},
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  expectedArtifacts: [
    {
      defaultArtifact: {
        customKind: true,
        id: 'useless - deployment - tag1'
      },
      displayName: 'deployment - tag1',
      id: 'deployment - tag1',
      matchArtifact: {
        id: 'useless - deployment - tag1 - match',
        name: 'component-name',
        type: 'embedded/base64'
      },
      useDefaultArtifact: false,
      usePriorArtifact: false
    }
  ],
  inputArtifacts: [
    {
      account: 'github-artifact',
      id: 'template - component-name'
    },
    {
      account: 'github-artifact',
      id: 'value - component-name'
    }
  ],
  name: 'Bake tag1',
  namespace: 'default',
  outputName: 'component-name-tag1',
  overrides: {
    'image.tag': 'imageurl.com',
    name: 'tag1'
  },
  templateRenderer: 'HELM2',
  type: 'bakeManifest',
  refId: `${index}`,
  requisiteStageRefIds: []
})
  
const getDeployStage = index => ({
  stageEnabled: {
    expression: '${ #stage(\'Bake tag1\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
  account: 'default',
  cloudProvider: 'kubernetes',
  moniker: {
    app: 'component-name'
  },
  manifestArtifactAccount: 'embedded-artifact',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifestArtifactId: 'deployment - tag1',
  name: 'Deploy tag1',
  skipExpressionEvaluation: false,
  source: 'artifact',
  trafficManagement: {
    enabled: false,
    options: {
      enableTraffic: false,
      services: []
    }
  },
  type: 'deployManifest',
  refId: `${index}`,
  requisiteStageRefIds: [
    `${index - 1}`
  ]
})
  
const getDestinationRulesStage = (index, dependsId) => ({
  stageEnabled: {
    expression: '',
    type: 'expression'
  },
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
        name: 'component-name',
        namespace: 'default'
      },
      spec: {
        host: 'component-name',
        subsets: [
          {
            labels: {
              version: 'component-name-tag1'
            },
            name: 'tag1'
          }
        ]
      }
    }
  ],
  moniker: {
    app: 'default'
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
  refId: `${index}`,
  requisiteStageRefIds: [
    `${dependsId}`
  ]
})
  
const getVirtualServicesStage = (index, dependsId) => ({
  stageEnabled: {
    expression: '${ #stage(\'Deploy Destination Rules\').status.toString() == \'SUCCEEDED\'}',
    type: 'expression'
  },
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
        name: 'component-name',
        namespace: 'default'
      },
      spec: {
        hosts: [
          'component-name'
        ],
        http: [
          {
            match: [
              {
                headers: {
                  cookie: {
                    regex: '.*x-circle-id=circle-header-id.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'component-name',
                  subset: 'tag1'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-header-id'
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
                    exact: 'circle-header-id'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'component-name',
                  subset: 'tag1'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-header-id'
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
  refId: `${index}`,
  requisiteStageRefIds: [
    `${dependsId}`
  ]
})
  
const getWebhookStage = index => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': 'Default'
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger webhook',
  payload: {
    status: '${#stage( \'Deploy tag1\' ).status.toString()}'
  },
  refId: `${index}`,
  requisiteStageRefIds: [
  
  ],
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: 'http://localhost:8883/deploy/notifications/deployment?queuedDeploymentId=1'
})
  
const main = parallelStages => {
  
  const webhookStage = getWebhookStage(parallelStages + 2)
  for (let i = 1; i <= parallelStages; i += 2) {
    spinnakerObject.stages.push(getBakeStage(i))
    spinnakerObject.stages.push(getDeployStage(i + 1))
    webhookStage.requisiteStageRefIds.push(`${i + 1}`)
  }
  spinnakerObject.stages.push(webhookStage)
  
  spinnakerObject.stages.push(getDestinationRulesStage(parallelStages + 3, parallelStages + 2))
  spinnakerObject.stages.push(getDestinationRulesStage(parallelStages + 4, parallelStages + 2))
  
  spinnakerObject.stages.push(getVirtualServicesStage(parallelStages + 5, parallelStages + 3))
  spinnakerObject.stages.push(getVirtualServicesStage(parallelStages + 6, parallelStages + 4))
  
  const webhookStage2 = getWebhookStage(parallelStages + 7)
  webhookStage2.requisiteStageRefIds.push(`${parallelStages + 5}`)
  webhookStage2.requisiteStageRefIds.push(`${parallelStages + 6}`)
  
  spinnakerObject.stages.push(webhookStage2)
  
  console.log(JSON.stringify(spinnakerObject))
}
  
main(10)