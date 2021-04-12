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
import { IstioManifestsUtils } from './istio-manifests.utilts'
import { DeploymentUtils } from './deployment.utils'
import { Deployment, DeploymentComponent } from '../../../api/deployments/interfaces/deployment.interface'
import { DestinationRuleSpec, VirtualServiceSpec } from '../../../operator/interfaces/params.interface'
import { AppConstants } from '../../constants'

const IstioDeploymentManifestsUtils = {

  getVirtualServiceManifest: (
    componentName: string,
    namespace: string,
    gatewayName: string | null,
    hostValue: string | null,
    componentSnapshots: Component[]
  ): VirtualServiceSpec => {

    return {
      apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
      kind: 'VirtualService',
      metadata: {
        name: componentName,
        namespace: namespace,
        annotations: {
          circles: JSON.stringify(componentSnapshots.map(c => c.deployment.circleId))
        }
      },
      spec: {
        gateways: gatewayName ? [gatewayName] : [],
        hosts: hostValue ? [hostValue, componentName] : [componentName],
        http: IstioDeploymentManifestsUtils.getVirtualServiceHTTPRules(componentSnapshots)
      }
    }
  },

  getDestinationRulesManifest: (
    componentName: string,
    namespace: string,
    componentSnapshots: Component[]
  ): DestinationRuleSpec => {
    return {
      apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
      kind: 'DestinationRule',
      metadata: {
        name: componentName,
        namespace: namespace,
        annotations: {
          circles: JSON.stringify(componentSnapshots.map(c => c.deployment.circleId))
        }
      },
      spec: {
        host: componentName,
        subsets: IstioDeploymentManifestsUtils.getDestinationRulesSubsets(componentSnapshots)
      }
    }
  },

  getDestinationRulesSubsets: (componentSnapshots: Component[]): Subset[] => {
    const subsets: Subset[] = []
    componentSnapshots.forEach(component => {
      const circleId = component.deployment.circleId
      subsets.push(IstioManifestsUtils.getDestinationRulesSubsetObject(component, circleId))
    })
    return subsets
  },

  getVirtualServiceHTTPRules: (componentSnapshots: Component[]): Http[] => {
    const rules: Http[] = []

    componentSnapshots.forEach(component => {
      const activeCircleId = component.deployment.circleId
      if (!component.deployment.defaultCircle) {
        rules.push(IstioManifestsUtils.getVirtualServiceHTTPCookieCircleRule(component.name, component.imageTag, activeCircleId))
        rules.push(IstioManifestsUtils.getVirtualServiceHTTPHeaderCircleRule(component.name, component.imageTag, activeCircleId))
      }
    })

    const defaultComponent: Component | undefined =
      componentSnapshots.find(component => component.deployment && component.deployment.defaultCircle)

    if (defaultComponent && defaultComponent.deployment) {
      rules.push(IstioManifestsUtils.getVirtualServiceHTTPDefaultRule(defaultComponent.name,  defaultComponent.deployment.circleId))
    }
    return rules
  }
}

export { IstioDeploymentManifestsUtils }
