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
import { isEmpty } from 'lodash'
import { DeploymentEntityV2 } from '../../api/deployments/entity/deployment.entity'
import { DeploymentStatusEnum } from '../../api/deployments/enums/deployment-status.enum'
import { ComponentsRepositoryV2 } from '../../api/deployments/repository'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { ExecutionRepository } from '../../api/deployments/repository/execution.repository'
import { NotificationStatusEnum } from '../../core/enums/notification-status.enum'
import { KubernetesManifest } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { K8sClient } from '../../core/integrations/k8s/client'
import { MooveService } from '../../core/integrations/moove'
import { ConsoleLoggerService } from '../../core/logs/console'
import { HookParams } from '../interfaces/params.interface'
import { ReconcileUtils } from '../utils/reconcile.utils'

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

  // TODO organize this method + remove comments
  public async execute(params: HookParams): Promise<{status?: unknown, children: KubernetesManifest[], resyncAfterSeconds?: number}> {
    // Get deployment and execution entities involved in the reconcile loop
    const deployment = await this.deploymentRepository.findWithComponentsAndConfig(params.parent.spec.deploymentId)

    // Remove service manifests from the list
    const rawSpecs = deployment.components.flatMap(c => c.manifests).filter(e => e.kind !== 'Service')

    // Insert charles metadata
    const specs = ReconcileUtils.addMetadata(rawSpecs, deployment)

    // If nothing has been created yet, return the desired state
    if (isEmpty(params.children['Deployment.apps/v1'])) {
      return { children: specs, resyncAfterSeconds: 5 }
    }

    // Get observed specs from the observed charlesdeployment
    const currentDeploymentSpecs = ReconcileUtils.specsByDeployment(params, deployment.id)

    // Check if all resources are ready
    const allReady = ReconcileUtils.checkConditions(currentDeploymentSpecs)

    // If not all resources are ready yet, concat the manifests from the previous deployment
    if (!allReady) {
      const previousDeploymentId = deployment.previousDeploymentId

      if (previousDeploymentId === null) {
        await this.deploymentRepository.updateHealthStatus(deployment.id, false)
        return { children: specs, resyncAfterSeconds: 5 }
      }
      const previousDeployment = await this.deploymentRepository.findWithComponentsAndConfig(previousDeploymentId)
      const currentAndPrevious = ReconcileUtils.concatWithPrevious(previousDeployment, specs)
      return { children: currentAndPrevious.filter(e => e.kind !== 'Service'), resyncAfterSeconds: 5 }
    }

    // If all resources are ready, update the routing CRD
    const activeComponents = await this.componentRepository.findActiveComponents()
    try {
      await this.k8sClient.applyRoutingCustomResource(activeComponents)
    } catch (error) {
      this.consoleLoggerService.error('DEPLOYMENT_RECONCILE:APPLY_ROUTE_CRD_ERROR', error)
      await this.deploymentRepository.updateHealthStatus(deployment.id, false)
      return { children: specs, resyncAfterSeconds: 5 }
    }

    // Set the observed deployment's healthy state to true
    await this.deploymentRepository.updateHealthStatus(deployment.id, true)

    // Notify success
    await this.notifyCallback(deployment, DeploymentStatusEnum.SUCCEEDED)

    // Return desired state
    return { children: specs }
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
}
