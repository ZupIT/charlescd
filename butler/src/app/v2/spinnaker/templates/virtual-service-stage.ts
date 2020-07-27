import { Component, Deployment } from '../../interfaces'
import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'
import { Http, Stage } from '../../interfaces/spinnaker-pipeline.interface'

export const getVirtualServiceStage = (
  component: Component,
  deployment: Deployment,
  activeComponents: Component[],
  stageId: number
): Stage => ({

  account: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).account}`,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: `${component.name}`,
        namespace: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        hosts: [
          `${component.name}`
        ],
        http: deployment.circleId ?
          getCircleHTTPRules(component, deployment.circleId, activeComponents) :
          getDefaultCircleHTTPRules(component, activeComponents)
      }
    }
  ],
  moniker: {
    app: 'default'
  },
  name: `Deploy Virtual Service ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${stageId - 1}`
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
})

const getCircleHTTPRules = (newComponent: Component, circleId: string, activeComponents: Component[]): Http[] => {
  const rules: Http[] = []

  rules.push(getHTTPCookieCircleRule(newComponent.name, newComponent.imageTag, circleId))
  rules.push(getHTTPHeaderCircleRule(newComponent.name, newComponent.imageTag, circleId))

  activeComponents.forEach(component => {
    const activeCircleId = component.deployment?.circleId
    if (activeCircleId && activeCircleId !== circleId) {
      rules.push(getHTTPCookieCircleRule(component.name, component.imageTag, activeCircleId))
      rules.push(getHTTPHeaderCircleRule(component.name, component.imageTag, activeCircleId))
    }
  })

  const defaultComponent: Component | undefined = activeComponents.find(component => component.deployment && !component.deployment.circleId)
  if (defaultComponent) {
    rules.push(getHTTPDefaultRule(defaultComponent.name, defaultComponent.imageTag))
  }
  return rules
}

const getDefaultCircleHTTPRules = (newComponent: Component, activeComponents: Component[]): Http[] => {
  const rules: Http[] = []

  activeComponents.forEach(component => {
    if (component.deployment?.circleId) {
      rules.push(getHTTPCookieCircleRule(component.name, component.imageTag, component.deployment.circleId))
      rules.push(getHTTPHeaderCircleRule(component.name, component.imageTag, component.deployment.circleId))
    }
  })

  rules.push(getHTTPDefaultRule(newComponent.name, newComponent.imageTag))

  return rules
}

const getHTTPCookieCircleRule = (name: string, tag: string, circle: string): Http => ({
  match: [
    {
      headers: {
        cookie: {
          regex: `.*x-circle-id=${circle}.*`
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: `${name}`,
        subset: `${tag}`
      },
      headers: {
        request: {
          set: {
            'x-circle-source': `${circle}`
          }
        },
        response: {
          set: {
            'x-circle-source': `${circle}`
          }
        }
      }
    }
  ]
})

const getHTTPHeaderCircleRule = (name: string, tag: string, circle: string): Http => ({
  match: [
    {
      headers: {
        'x-circle-id': {
          exact: `${circle}`
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: `${name}`,
        subset: `${tag}`
      },
      headers: {
        request: {
          set: {
            'x-circle-source': `${circle}`
          }
        },
        response: {
          set: {
            'x-circle-source': `${circle}`
          }
        }
      }
    }
  ]
})

const getHTTPDefaultRule = (name: string, tag: string): Http => ({
  route: [
    {
      destination: {
        host: `${name}`,
        subset: `${tag}`
      },
      headers: {
        request: {
          set: {
            'x-circle-source': 'default-circle-id' // TODO use constant
          }
        },
        response: {
          set: {
            'x-circle-source': 'default-circle-id' // TODO use constant
          }
        }
      }
    }
  ]
})