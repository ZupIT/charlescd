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
import { groupBy } from 'lodash'
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
import { DeploymentStatusEnum } from '../../api/deployments/enums/deployment-status.enum'
import { NotificationStatusEnum } from '../../core/enums/notification-status.enum'
import { ExecutionRepository } from '../../api/deployments/repository/execution.repository'
import { MooveService } from '../../core/integrations/moove'

@Injectable()
export class ReconcileRoutesUsecase {

  constructor(
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentsRepository: ComponentsRepositoryV2,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly executionRepository: ExecutionRepository,
    private readonly mooveService: MooveService,
  ) { }

  public async execute(hookParams: RouteHookParams): Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    this.consoleLoggerService.log('START:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE')
    let specs: (VirtualServiceSpec | DestinationRuleSpec)[] = []
    let services : KubernetesObject[] = []

    const componentSnapshots = await this.getDesiredComponentSnapshots(hookParams)
    const namespacedComponentSnapshots = groupBy(componentSnapshots, component => component.deployment.namespace)
    for (const namespace in namespacedComponentSnapshots) {
      services = services.concat(this.getServicesWithMetadata(namespacedComponentSnapshots[namespace]))
      specs = specs.concat(this.createProxyManifests(namespace, namespacedComponentSnapshots[namespace]))
    }
    const healthStatus = this.getRoutesStatus(hookParams, specs)
    await this.updateRouteStatus(healthStatus)
    return { children: [...specs, ...services], resyncAfterSeconds: 5 }
  }

  private async getDesiredComponentSnapshots(hookParams: RouteHookParams): Promise<ComponentEntityV2[]> {
    const observedCircles = hookParams.parent.spec.circles
    const componentSnapshots = []
    for (const circle of observedCircles) {
      const currentHealthySnapshots = await this.componentsRepository.findCurrentHealthyComponentsByCircleId(circle.id)
      const previousSnapshots =  await this.componentsRepository.findPreviousComponentsFromCurrentUnhealthyByCircleId(circle.id)
      componentSnapshots.push([...currentHealthySnapshots, ...previousSnapshots])
    }
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
      if (allTrue) {
        const deployment = await this.deploymentRepository.findByCircleId(circleId)
        await this.notifyCallback(deployment, DeploymentStatusEnum.SUCCEEDED)
      }
      return await this.deploymentRepository.updateRouteStatus(circleId, allTrue)
    }))
    return results
  }

  private async notifyCallback(deployment: DeploymentEntityV2, status: DeploymentStatusEnum) {
    const execution = await this.executionRepository.findByDeploymentId(deployment.id)
    if (execution.notificationStatus === NotificationStatusEnum.NOT_SENT) {
      const notificationResponse = await this.mooveService.notifyDeploymentStatusV2(
        execution.deploymentId,
        status,
        deployment.callbackUrl,
        deployment.circleId
      )
      await this.executionRepository.updateNotificationStatus(execution.id, notificationResponse.status)
    }
  }

  // TODO check for services too, right now we only check for DR + VS
  private handleSpecStatus(observed: PartialRouteHookParams, spec: SpecsUnion, circleId: string): { circle: string, component: string, status: boolean, kind: string } {
    const baseResponse = {
      circle: circleId,
      component: spec.metadata.name,
      kind: spec.kind,
      status: false
    }
    if (ReconcileUtils.checkObservedRoutesEmptiness(observed)) {
      baseResponse.status = false
      return baseResponse
    }
    baseResponse.status = ReconcileUtils.checkIfComponentRoutesExistOnObserved(observed, spec, circleId)
    return baseResponse
  }

  private getServicesWithMetadata(components: ComponentEntityV2[]): KubernetesManifest[] {
    return components.flatMap(component => {
      const serviceManifests = ReconcileUtils.getComponentServiceManifests(component)
      return serviceManifests.map(manifest => this.addCharlesMetadata(manifest, component.deployment))
    })
  }

  // TODO create a class that implements the KubernetesObject interface and move this method inside it
  private addCharlesMetadata(manifest: KubernetesManifest, deployment: DeploymentEntityV2): KubernetesManifest {
    manifest.metadata = {
      ...manifest.metadata,
      namespace: deployment.namespace,
      labels: {
        ...manifest.metadata?.labels,
        'deploymentId': deployment.id,
        'circleId': deployment.circleId
      }
    }
    return manifest
  }
}
