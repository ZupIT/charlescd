/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import { isEmpty, uniqWith } from 'lodash'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { ExecutionRepository } from '../../api/deployments/repository/execution.repository'
import { KubernetesManifest, SpecTemplateManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { K8sClient } from '../../core/integrations/k8s/client'
import { MooveService } from '../../core/integrations/moove'
import { ConsoleLoggerService } from '../../core/logs/console'
import { HookParams, SpecMetadata, SpecStatus } from '../interfaces/params.interface'
import { ReconcileUtils } from '../utils/reconcile.utils'
import { ComponentEntityV2 } from '../../api/deployments/entity/component.entity'

@Injectable()
export class ReconcileDeploymentUsecase {

  constructor(
    private readonly k8sClient: K8sClient,
    private readonly deploymentRepository: DeploymentRepositoryV2,
    private readonly componentRepository: ComponentsRepositoryV2,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly executionRepository: ExecutionRepository,
    private readonly mooveService: MooveService
  ) { }

  public async execute(params: HookParams): Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    this.consoleLoggerService.log('START_DEPLOYMENT_RECONCILE', params)
    const deployment = await this.deploymentRepository.findWithComponentsAndConfig(params.parent.spec.deploymentId)
    const desiredManifests = this.getDesiredManifests(deployment)
    const resourcesCreated = this.checkIfResourcesWereCreated(params)
    // TODO check if this is necessary
    if (!resourcesCreated) {
      return { children: desiredManifests, resyncAfterSeconds: 5 }
    }

    const isDeploymentReady = this.checkIfDeploymentIsReady(params, deployment.id)
    if (!isDeploymentReady) {
      // if is not ready it must not remove old deployment until current is healthy
      const previousDeploymentId = deployment.previousDeploymentId
      if (previousDeploymentId === null) {
        await this.deploymentRepository.updateHealthStatus(deployment.id, false)
        return { children: desiredManifests, resyncAfterSeconds: 5 }
      }
      const previousDeployment = await this.deploymentRepository.findWithComponentsAndConfig(previousDeploymentId)
      const currentAndPrevious = uniqWith(
        [...this.getDesiredManifests(previousDeployment), ...desiredManifests],
        ReconcileUtils.isNameAndKindEqual
      )
      return { children: currentAndPrevious, resyncAfterSeconds: 5 }
    }

    const activeComponents = await this.componentRepository.findActiveComponents()
    try {
      await this.k8sClient.applyRoutingCustomResource(activeComponents)
    } catch (error) {
      this.consoleLoggerService.error('DEPLOYMENT_RECONCILE:APPLY_ROUTE_CRD_ERROR', error)
      await this.deploymentRepository.updateHealthStatus(deployment.id, false)
      return { children: desiredManifests, resyncAfterSeconds: 5 }
    }

    await this.deploymentRepository.updateHealthStatus(deployment.id, true)
    return { children: desiredManifests }
  }



  private getDesiredManifests(deployment: DeploymentEntityV2): KubernetesManifest[] {
    return deployment.components.flatMap(component => {
      const manifests = component.manifests.filter(e => e.kind !== 'Service')
      return manifests.map(manifest => this.addCharlesMetadata(manifest, component, deployment))
    })
  }

  // TODO create a class that implements the KubernetesObject interface and move this method inside it
  private addCharlesMetadata(
    manifest: KubernetesManifest & SpecTemplateManifest,
    component: ComponentEntityV2,
    deployment: DeploymentEntityV2
  ): KubernetesManifest {

    manifest.metadata = {
      ...manifest.metadata,
      namespace: deployment.namespace,
      labels: {
        ...manifest.metadata?.labels,
        'deploymentId': deployment.id,
        'circleId': deployment.circleId
      }
    }

    // TODO what about other resources such as StatefulSet, CronJob etc?
    if (manifest.kind === 'Deployment') {
      manifest.metadata.name = `${manifest.metadata.name}-${component.imageTag}-${deployment.id}`
    }

    if (manifest.spec?.template) {
      manifest.spec.template.metadata = {
        ...manifest.spec.template.metadata,
        labels: {
          ...manifest.spec.template.metadata?.labels,
          'deploymentId': deployment.id,
          'circleId': deployment.circleId
        }
      }
    }

    return manifest
  }

  private checkIfResourcesWereCreated(params: HookParams): boolean {
    // TODO we should also check if other resources were created
    return !isEmpty(params.children['Deployment.apps/v1'])
  }

  private checkIfDeploymentIsReady(params: HookParams, deploymentId: string): boolean {
    // TODO we should also check if other resources are ready
    const deploymentManifests = Object.entries(params.children['Deployment.apps/v1'])
      .map(c => c[1])
      .filter(p => p.metadata.labels.deploymentId === deploymentId)

    return this.checkDeploymentConditions(deploymentManifests)
  }

  private checkDeploymentConditions(specs: { metadata: SpecMetadata, status: SpecStatus }[]): boolean {
    if (specs.length === 0) {
      return false
    }
    return specs.every(s => {
      if (s.status.conditions.length === 0) {
        return true
      }
      const conditions = s.status.conditions
      const minimumReplicaCondition = conditions.filter(c => c.type === 'Available' && c.reason === 'MinimumReplicasAvailable')
      const replicaSetAvailableCondition = conditions.filter(c => c.type === 'Progressing' && c.reason === 'NewReplicaSetAvailable')

      if (minimumReplicaCondition.length === 0) {
        return false
      }
      if (replicaSetAvailableCondition.length === 0) {
        return false
      }

      const allAvailable = minimumReplicaCondition.every(c => c.status === 'True')
      const allProgressing = replicaSetAvailableCondition.every(c => c.status === 'True')

      return allAvailable && allProgressing
    })
  }
}
