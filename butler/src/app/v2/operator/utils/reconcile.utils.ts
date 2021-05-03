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

import { KubernetesObject } from '@kubernetes/client-node'
import { ComponentEntityV2 } from '../../api/deployments/entity/component.entity'
import { PartialRouteHookParams, SpecsUnion } from '../interfaces/partial-params.interface'
import { isEmpty } from 'lodash'

export class ReconcileUtils {

  public static getCreatedAtTimeDiff(component1: ComponentEntityV2, component2: ComponentEntityV2): number {
    return component1.deployment.createdAt.getTime() - component2.deployment.createdAt.getTime()
  }

  public static isNameAndKindEqual(manifest1: KubernetesObject, manifest2: KubernetesObject): boolean {
    return manifest1.metadata?.name === manifest2.metadata?.name && manifest1.kind === manifest2.kind
  }

  public static getComponentServiceManifests(component: ComponentEntityV2): KubernetesObject[]  {
    return component.manifests.filter(m => m.kind === 'Service')
  }

  // TODO this is highly coupled with Istio. Maybe implement strategy pattern once butler support other service meshes.
  public static checkObservedRoutesEmptiness(observed: PartialRouteHookParams): boolean {
    const emptyDestinationRules = isEmpty(observed.children['DestinationRule.networking.istio.io/v1alpha3'])
    const emptyVirtualServices = isEmpty(observed.children['VirtualService.networking.istio.io/v1alpha3'])
    return emptyDestinationRules || emptyVirtualServices
  }

  // TODO this is highly coupled with Istio. Maybe implement strategy pattern once butler support other service meshes.
  public static checkIfComponentRoutesExistOnObserved(observed: PartialRouteHookParams, spec: SpecsUnion, circleId: string): boolean {
    const observedResourceName = `${spec.metadata.namespace}/${spec.metadata.name}`
    const observedDestinationRules = observed.children['DestinationRule.networking.istio.io/v1alpha3'][observedResourceName]
    const observedVirtualService = observed.children['VirtualService.networking.istio.io/v1alpha3'][observedResourceName]
    if (!observedDestinationRules || !observedVirtualService) {
      return false
    }

    const destinationRulesCircles : string[] = JSON.parse(observedDestinationRules.metadata.annotations.circles)
    const virtualServiceCircles : string [] = JSON.parse(observedVirtualService.metadata.annotations.circles)
    return destinationRulesCircles.includes(circleId) && virtualServiceCircles.includes(circleId)
  }
}
