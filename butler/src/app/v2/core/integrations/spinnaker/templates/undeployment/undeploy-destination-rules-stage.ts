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
import { AppConstants } from '../../../../../../v1/core/constants'
import { CommonTemplateUtils } from '../../utils/common-template.utils'

export const getUndeploymentDestinationRulesStage = (
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
      kind: 'DestinationRule',
      metadata: {
        name: `${component.name}`,
        namespace: `${(deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).namespace}`
      },
      spec: {
        host: component.hostValue ? component.hostValue : component.name,
        subsets: getActiveComponentsSubsets(deployment.circleId, activeComponents)
      }
    }
  ],
  moniker: {
    app: 'default'
  },
  name: `Undeploy Destination Rules ${component.name}`,
  refId: `${stageId}`,
  requisiteStageRefIds: [],
  skipExpressionEvaluation: false,
  source: 'text',
  trafficManagement: {
    enabled: false,
    options: {
      enableTraffic: false,
      services: []
    }
  },
  type: 'deployManifest'
})

const getActiveComponentsSubsets = (circleId: string | null, activeComponents: Component[]): Subset[] => {
  const subsets: Subset[] = []

  activeComponents.forEach(component => {
    const activeCircleId = component.deployment?.circleId

    if (activeCircleId && activeCircleId !== circleId && !subsets.find(subset => subset.name === component.imageTag)) {
      subsets.push(getSubsetObject(component, activeCircleId))
    }
  })

  const defaultComponent: Component | undefined = activeComponents.find(component => component.deployment && !component.deployment.circleId)
  if (defaultComponent && !subsets.find(subset => subset.name === defaultComponent.imageTag)) {
    subsets.push(getSubsetObject(defaultComponent, null))
  }
  return subsets
}

const getSubsetObject = (component: Component, circleId: string | null): Subset => {
  return {
    labels: {
      component: component.name,
      tag: component.imageTag,
      circleId: CommonTemplateUtils.getCircleId(circleId)
    },
    name: CommonTemplateUtils.getCircleId(circleId)
  }
}