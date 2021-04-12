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

import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import { Injectable } from '@nestjs/common'
import { groupBy, isEmpty } from 'lodash'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { IstioDeploymentManifestsUtils } from '../../core/integrations/utils/istio-deployment-manifests.utils'
import { ConsoleLoggerService } from '../../core/logs/console'
import { DestinationRuleSpec, RouteHookParams, VirtualServiceSpec } from '../interfaces/params.interface'
import { PartialRouteHookParams, SpecsUnion } from '../interfaces/partial-params.interface'
import { ComponentEntityV2 } from '../../api/deployments/entity/component.entity'
import { ReconcileUtils } from '../utils/reconcile.utils'

@Injectable()
export class ReconcileRoutesUsecase {

  constructor(
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentsRepository: ComponentsRepositoryV2,
    private readonly consoleLoggerService: ConsoleLoggerService,
  ) { }

  public async execute(hookParams: RouteHookParams): Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    this.consoleLoggerService.log('START:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE')
    let specs: (VirtualServiceSpec | DestinationRuleSpec)[] = []
    let services : KubernetesObject[] = []

    const componentSnapshots = await this.getDesiredComponentSnapshots(hookParams)
    const namespacedComponentSnapshots = groupBy(componentSnapshots, component => component.deployment.namespace)
    for (const namespace in namespacedComponentSnapshots) {
      services = services.concat(ReconcileUtils.getComponentsServiceManifests(namespacedComponentSnapshots[namespace]))
      specs = specs.concat(this.createProxyManifests(namespace, namespacedComponentSnapshots[namespace]))
    }
    const healthStatus = this.getRoutesStatus(hookParams, specs)
    await this.updateRouteStatus(healthStatus)
    return { children: [...specs, ...services], resyncAfterSeconds: 5 }
  }

  private async getDesiredComponentSnapshots(hookParams: RouteHookParams): Promise<ComponentEntityV2[]> {
    const observedCircles = hookParams.parent.spec.circles
    const componentSnapshots = await Promise.all(observedCircles.map(circle =>
      this.componentsRepository.findActiveComponentsByCircleId(circle.id)
    ))
    return componentSnapshots.flatMap(c => c)
  }

  private createProxyManifests(
    namespace: string,
    components: ComponentEntityV2[]
  ): (VirtualServiceSpec | DestinationRuleSpec)[] {

    const proxyManifests: (VirtualServiceSpec | DestinationRuleSpec)[] = []
    const componentsNameMap = groupBy(components, 'name')
    for (const componentName in componentsNameMap) {
      proxyManifests.push(
        ...this.createIstioManifests(componentName, namespace, componentsNameMap[componentName])
      )
    }
    return proxyManifests
  }

  private createIstioManifests(
    componentName: string,
    namespace: string,
    componentsByName: ComponentEntityV2[]
  ): (VirtualServiceSpec | DestinationRuleSpec)[] {

    const lastComponentSnapshot = this.getLastComponentSnapshot(componentsByName)
    const destinationRules =
      IstioDeploymentManifestsUtils.getDestinationRulesManifest(componentName, namespace, componentsByName)
    const virtualService =
      IstioDeploymentManifestsUtils.getVirtualServiceManifest(
        componentName, namespace, lastComponentSnapshot.gatewayName, lastComponentSnapshot.hostValue, componentsByName
      )
    return [destinationRules, virtualService]
  }

  private getLastComponentSnapshot(components: ComponentEntityV2[]): ComponentEntityV2 {
    const sortedArray = [...components].sort(ReconcileUtils.getCreatedAtTimeDiff)
    return sortedArray[sortedArray.length - 1]
  }

  public getRoutesStatus(observed: PartialRouteHookParams, desired: SpecsUnion[]): {circle: string, component: string, status: boolean, kind: string}[] {
    if (desired.length === 0) {
      return []
    }
    return desired.flatMap(spec => {
      const circles : string[] = JSON.parse(spec.metadata.annotations.circles)
      return circles.flatMap(desiredCircleId => {
        return this.handleSpecStatus(observed, spec, desiredCircleId)
      })
    })
  }

  public async updateRouteStatus(componentStatus: { circle: string, component: string, status: boolean, kind: string }[]): Promise<DeploymentEntityV2[]>  {
    const components = groupBy(componentStatus, 'circle')
    const results =  await Promise.all(Object.entries(components).flatMap(async c => {
      const circleId = c[0]
      const status = c[1]
      const allTrue = status.every(s => s.status === true)
      return await this.deploymentRepository.updateRouteStatus(circleId, allTrue)
    }))
    return results
  }

  // TODO check for services too, right now we only check for DR + VS
  private handleSpecStatus(observed: PartialRouteHookParams, spec: SpecsUnion, circleId: string): { circle: string, component: string, status: boolean, kind: string } {
    const baseResponse = {
      circle: circleId,
      component: spec.metadata.name,
      kind: spec.kind,
      status: false
    }
    if (this.checkEmptySpecs(observed) === true) {
      baseResponse.status = false
      return baseResponse
    }
    baseResponse.status = this.checkComponentExistsOnObserved(observed, spec, circleId)
    return baseResponse
  }

  private checkEmptySpecs(observed: PartialRouteHookParams): boolean {
    const emptyDestinationRules = isEmpty(observed.children['DestinationRule.networking.istio.io/v1alpha3'])
    const emptyVirtualServices = isEmpty(observed.children['VirtualService.networking.istio.io/v1alpha3'])
    return emptyDestinationRules || emptyVirtualServices
  }

  private checkComponentExistsOnObserved(observed: PartialRouteHookParams, spec: SpecsUnion, circleId: string): boolean {
    const destionRulesCircles : string[] = JSON.parse(observed.children['DestinationRule.networking.istio.io/v1alpha3'][spec.metadata.name].metadata.annotations.circles)
    const desiredDestinationRulePresent = destionRulesCircles.includes(circleId)
    const virtualServiceCircles : string [] = JSON.parse(observed.children['VirtualService.networking.istio.io/v1alpha3'][spec.metadata.name].metadata.annotations.circles)
    const desiredVirtualServicePresent = virtualServiceCircles.includes(circleId)
    return desiredDestinationRulePresent && desiredVirtualServicePresent
  }
}
