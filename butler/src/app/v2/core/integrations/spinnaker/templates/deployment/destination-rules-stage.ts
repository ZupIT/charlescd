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
import { Stage, Subset } from '../../interfaces/spinnaker-pipeline.interface'
import { Component, Deployment } from '../../../../../api/deployments/interfaces'

export const getDestinationRulesStage = (
  component: Component,
  deployment: Deployment,
  activeComponents: Component[],
  stageId: number,
  evalStageId: number
): Stage => ({
  account: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).account}`,
  cloudProvider: 'kubernetes',
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  failPipeline: false,
  manifests: [
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: `${component.name}`,
        namespace: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        host: `${component.name}`,
        subsets: deployment?.components ? getSubsets(component, deployment.circleId, activeComponents) : []
      }
    }
  ],
  moniker: {
    app: 'default'
  },
  name: `Deploy Destination Rules ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [
    `${evalStageId}`
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
})

const getSubsets = (newComponent: Component, circleId: string | null, activeComponents: Component[]): Subset[] => {
  const subsets: Subset[] = []
  subsets.push(getSubsetObject(newComponent))

  activeComponents.forEach(component => {
    const activeCircleId = component.deployment?.circleId
    if (activeCircleId && activeCircleId !== circleId) {
      subsets.push(getSubsetObject(component))
    }
  })

  const defaultComponent: Component | undefined = activeComponents.find(component => component.deployment && !component.deployment.circleId)
  if (defaultComponent) {
    subsets.push(getSubsetObject(defaultComponent))
  }
  return subsets
}

const getSubsetObject = (component: Component): Subset => {
  return {
    labels: {
      version: `${component.name}-${component.imageTag}`
    },
    name: `${component.imageTag}`
  }
}