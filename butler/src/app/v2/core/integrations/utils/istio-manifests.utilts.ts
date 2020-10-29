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

import { Http, Subset } from '../interfaces/k8s-manifest.interface'
import { Component } from '../../../api/deployments/interfaces'
import { CommonTemplateUtils } from '../spinnaker/utils/common-template.utils'
import { AppConstants } from '../../../../v1/core/constants'

const IstioManifestsUtils = {

  getDestinationRulesSubsetObject: (component: Component, circleId: string | null): Subset => {
    return {
      labels: {
        component: component.name,
        tag: component.imageTag,
        circleId: CommonTemplateUtils.getCircleId(circleId)
      },
      name: CommonTemplateUtils.getCircleId(circleId)
    }
  },

  getVirtualServiceHTTPCookieCircleRule: (name: string, tag: string, circle: string): Http => ({
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
          host: name,
          subset: circle
        },
        headers: {
          request: {
            set: {
              'x-circle-source': circle
            }
          },
          response: {
            set: {
              'x-circle-source': circle
            }
          }
        }
      }
    ]
  }),

  getVirtualServiceHTTPHeaderCircleRule: (name: string, tag: string, circle: string): Http => ({
    match: [
      {
        headers: {
          'x-circle-id': {
            exact: circle
          }
        }
      }
    ],
    route: [
      {
        destination: {
          host: name,
          subset: circle
        },
        headers: {
          request: {
            set: {
              'x-circle-source': circle
            }
          },
          response: {
            set: {
              'x-circle-source': circle
            }
          }
        }
      }
    ]
  }),

  getVirtualServiceHTTPDefaultRule: (name: string): Http => ({
    route: [
      {
        destination: {
          host: name,
          subset: AppConstants.DEFAULT_CIRCLE_ID
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
}

export { IstioManifestsUtils }
