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

import { Injectable } from '@nestjs/common'
import { CdConfigurationsRepository } from '../../api/configurations/repository'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { Component } from '../../api/deployments/interfaces'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { DeploymentUtils } from '../../core/integrations/utils/deployment.utils'
import { IstioDeploymentManifestsUtils } from '../../core/integrations/utils/istio-deployment-manifests.utils'
import { ConsoleLoggerService } from '../../core/logs/console'
import { HookParams } from '../params.interface'

@Injectable()
export class CreateRoutesManifestsUseCase {

  constructor(
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentsRepository: ComponentsRepositoryV2,
    private readonly cdConfigurationsRepository: CdConfigurationsRepository,
    private readonly consoleLoggerService: ConsoleLoggerService,
  ) { }

  public async execute(hookParams: HookParams): Promise<KubernetesManifest[]> {
    try {
      this.consoleLoggerService.log('START:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE', { hookParams })
      const deployment = await this.retriveDeploymentFor(hookParams.parent.spec.deploymentId)
      const activeComponents = await this.componentsRepository.findActiveComponents('b46fd548-0082-4021-ba80-a50703c44a3a')

      const proxySpecs = this.createProxySpecsFor(deployment, activeComponents)

      this.consoleLoggerService.log('FINISH:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE')
      return proxySpecs
    } catch (error) {
      this.consoleLoggerService.error('ERROR:EXECUTE_RECONCILE_ROUTE_MANIFESTS_USECASE', error)
      throw error
    }
  }

  private async retriveDeploymentFor(id: string): Promise<DeploymentEntityV2> {
    const deployment = await this.deploymentRepository.findOneOrFail({ id: id }, { relations: ['cdConfiguration', 'components'] })

    if (deployment) {
      deployment.cdConfiguration = await this.cdConfigurationsRepository.findDecrypted(deployment.cdConfiguration.id)
    }

    return deployment
  }

  private createProxySpecsFor(deployment: DeploymentEntityV2, activeComponents: Component[]): KubernetesManifest[] {
    const proxySpecs: KubernetesManifest[] = []
    deployment.components.forEach(component => {
      const manifests = this.createIstioProxiesManifestsFor(deployment, component, activeComponents)
      manifests.forEach(m => proxySpecs.push(m))
    })
    return proxySpecs
  }

  private createIstioProxiesManifestsFor(deployment: DeploymentEntityV2, 
    newComponent: Component, 
    activeComponents: Component[]
  ): [KubernetesManifest, KubernetesManifest] {
    const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, newComponent.name)
    const destinationRules = IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
    const virtualService = IstioDeploymentManifestsUtils.getVirtualServiceManifest(deployment, newComponent, activeByName)
    return [destinationRules, virtualService]
  }
}

