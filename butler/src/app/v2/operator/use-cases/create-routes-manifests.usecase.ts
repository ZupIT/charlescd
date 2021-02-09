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
import { isEmpty, isEqual } from 'lodash'
import { CdConfigurationsRepository } from '../../api/configurations/repository'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { Component } from '../../api/deployments/interfaces'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { DeploymentUtils } from '../../core/integrations/utils/deployment.utils'
import { IstioDeploymentManifestsUtils } from '../../core/integrations/utils/istio-deployment-manifests.utils'
import { ConsoleLoggerService } from '../../core/logs/console'
import { DestinationRuleSpec, RouteChildren, RouteHookParams, VirtualServiceSpec } from '../params.interface'

@Injectable()
export class CreateRoutesManifestsUseCase {

  constructor(
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentsRepository: ComponentsRepositoryV2,
    private readonly cdConfigurationsRepository: CdConfigurationsRepository,
    private readonly consoleLoggerService: ConsoleLoggerService,
  ) { }

  public async execute(hookParams: RouteHookParams): Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    this.consoleLoggerService.log('START:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE')
    let specs : (VirtualServiceSpec | DestinationRuleSpec)[]= []
    for (const c of hookParams.parent.spec.circles) {
      const deployment = await this.retriveDeploymentFor(c.id)
      const activeComponents = await this.componentsRepository.findActiveComponents(deployment.cdConfiguration.id)
      const proxySpecs = this.createProxySpecsFor(deployment, activeComponents)
      specs = specs.concat(proxySpecs)
    }
    console.log({
      observed: JSON.stringify(hookParams),
      desired: JSON.stringify(specs)
    })
    return { children: specs }
  }

  public checkRoutes(observed: RouteHookParams, desired: (VirtualServiceSpec | DestinationRuleSpec)[]): boolean[] {
    const a = observed.parent.spec.circles.flatMap(circle => {
      return circle.components.flatMap(component => {
        const presentComponents = desired.filter( d => component.name === d.metadata.name)
      })
    })

    return a
    // const desiredDestinationRules: DestinationRuleSpec[] = desired.filter(this.isDestinationRule)
    // desired.map(d => {
    //   const presentOnDestinationRules = d.metadata.name in observed['DestinationRule.networking.istio.io/v1beta1']
    //   const presentOnDestinationVirtualServices = d.metadata.name in observed['VirtualService.networking.istio.io/v1beta1']
    //   if (!presentOnDestinationRules && !presentOnDestinationVirtualServices) {
    //     return {
    //       circle:
    //     }
    //   }



    // })
  }

  private async retriveDeploymentFor(id: string): Promise<DeploymentEntityV2> {
    const deployment = await this.deploymentRepository.findOneOrFail({ circleId: id, current: true }, { relations: ['cdConfiguration', 'components'] })

    if (deployment) {
      deployment.cdConfiguration = await this.cdConfigurationsRepository.findDecrypted(deployment.cdConfiguration.id)
    }

    return deployment
  }

  private createProxySpecsFor(deployment: DeploymentEntityV2, activeComponents: Component[]): (VirtualServiceSpec | DestinationRuleSpec)[] {
    const proxySpecs: (VirtualServiceSpec | DestinationRuleSpec)[] = []
    deployment.components.forEach(component => {
      const manifests = this.createIstioProxiesManifestsFor(deployment, component, activeComponents)
      manifests.forEach(m => proxySpecs.push(m))
    })
    return proxySpecs
  }

  private createIstioProxiesManifestsFor(deployment: DeploymentEntityV2,
    newComponent: Component,
    activeComponents: Component[]
  ): (VirtualServiceSpec | DestinationRuleSpec)[] {
    const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, newComponent.name)
    const destinationRules = IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
    const virtualService = IstioDeploymentManifestsUtils.getVirtualServiceManifest(deployment, newComponent, activeByName)
    return [destinationRules, virtualService]
  }

  private isDestinationRule(manifest: (VirtualServiceSpec | DestinationRuleSpec)): manifest is DestinationRuleSpec {
    return manifest.kind === 'DestinationRule'
  }
}
