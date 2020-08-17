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

import { ISpinnakerConfigurationData } from '../../../../../../v1/api/configurations/interfaces'
import { Http, Stage } from '../../interfaces/spinnaker-pipeline.interface'
import { AppConstants } from '../../../../../../v1/core/constants'
import { Component, Deployment } from '../../../../../api/deployments/interfaces'

export const getUndeploymentVirtualServiceStage = (
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
        http: getActiveComponentsCircleHTTPRules(deployment.circleId, activeComponents)
      }
    }
  ],
  moniker: {
    app: 'default'
  },
  name: `Undeploy Virtual Service ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${stageId - 1}`
  ],
  skipExpressionEvaluation: false,
  source: 'text',
  stageEnabled: {
    expression: '${ #stage(\'' + `Undeploy Destination Rules ${component.name}` + '\').status.toString() == \'SUCCEEDED\'}',
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

const getActiveComponentsCircleHTTPRules = (circleId: string | null, activeComponents: Component[]): Http[] => {
  const rules: Http[] = []

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
})