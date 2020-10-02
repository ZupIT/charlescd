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

import { Http, K8sManifest, Subset } from '../interfaces/k8s-manifest.interface'
import { ISpinnakerConfigurationData } from '../../../../v1/api/configurations/interfaces'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import { IstioManifestsUtils } from './istio-manifests.utilts'

const IstioDeploymentManifestsUtils = {

  getVirtualServiceManifest: (deployment: Deployment, component: Component, activeByName: Component[]): K8sManifest => {
    return {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: `${component.name}`,
        namespace: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        gateways: component.gatewayName ? [component.gatewayName] : [],
        hosts: component.hostValue ? [component.hostValue, component.name] : [component.name],
        http: deployment.circleId ?
          IstioDeploymentManifestsUtils.getCircleHTTPRules(component, deployment.circleId, activeByName) :
          IstioDeploymentManifestsUtils.getDefaultCircleHTTPRules(component, activeByName)
      }
    }
  },

  getDestinationRulesManifest: (deployment: Deployment, component: Component, activeByName: Component[]): K8sManifest => {
    return {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: component.name,
        namespace: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        host: component.name,
        subsets: deployment?.components ? IstioDeploymentManifestsUtils.getDestinationRulesSubsets(component, deployment.circleId, activeByName) : []
      }
    }
  },

  getDestinationRulesSubsets: (newComponent: Component, circleId: string | null, activeByName: Component[]): Subset[] => {
    const subsets: Subset[] = []
    subsets.push(IstioManifestsUtils.getDestinationRulesSubsetObject(newComponent, circleId))

    activeByName.forEach(component => {
      const activeCircleId = component.deployment?.circleId
      if (activeCircleId && activeCircleId !== circleId) {
        subsets.push(IstioManifestsUtils.getDestinationRulesSubsetObject(component, activeCircleId))
      }
    })

    const defaultComponent: Component | undefined = activeByName.find(component => component.deployment && !component.deployment.circleId)
    if (defaultComponent) {
      subsets.push(IstioManifestsUtils.getDestinationRulesSubsetObject(defaultComponent, null))
    }
    return subsets
  },

  getCircleHTTPRules: (newComponent: Component, circleId: string, activeByName: Component[]): Http[] => {
    const rules: Http[] = []

    rules.push(IstioManifestsUtils.getVirtualServiceHTTPCookieCircleRule(newComponent.name, newComponent.imageTag, circleId))
    rules.push(IstioManifestsUtils.getVirtualServiceHTTPHeaderCircleRule(newComponent.name, newComponent.imageTag, circleId))

    activeByName.forEach(component => {
      const activeCircleId = component.deployment?.circleId
      if (activeCircleId && activeCircleId !== circleId) {
        rules.push(IstioManifestsUtils.getVirtualServiceHTTPCookieCircleRule(component.name, component.imageTag, activeCircleId))
        rules.push(IstioManifestsUtils.getVirtualServiceHTTPHeaderCircleRule(component.name, component.imageTag, activeCircleId))
      }
    })

    const defaultComponent: Component | undefined = activeByName.find(component => component.deployment && !component.deployment.circleId)
    if (defaultComponent) {
      rules.push(IstioManifestsUtils.getVirtualServiceHTTPDefaultRule(defaultComponent.name))
    }
    return rules
  },

  getDefaultCircleHTTPRules: (newComponent: Component, activeByName: Component[]): Http[] => {
    const rules: Http[] = []

    activeByName.forEach(component => {
      if (component.deployment?.circleId) {
        rules.push(IstioManifestsUtils.getVirtualServiceHTTPCookieCircleRule(component.name, component.imageTag, component.deployment.circleId))
        rules.push(IstioManifestsUtils.getVirtualServiceHTTPHeaderCircleRule(component.name, component.imageTag, component.deployment.circleId))
      }
    })

    rules.push(IstioManifestsUtils.getVirtualServiceHTTPDefaultRule(newComponent.name))

    return rules
  }
}

export { IstioDeploymentManifestsUtils }
