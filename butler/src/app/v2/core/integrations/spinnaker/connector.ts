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

import { Component, ConnectorResult, Deployment, SpinnakerPipeline } from './interfaces'
import { ExpectedArtifact, Stage } from './interfaces/spinnaker-pipeline.interface'
import {
  getBakeStage,
  getDeleteUnusedStage,
  getDeploymentsEvaluationStage,
  getDeploymentStage,
  getFailureWebhookStage,
  getHelmTemplateObject,
  getHelmValueObject,
  getRollbackDeploymentsStage,
  getSuccessWebhookStage
} from './templates'
import { getDestinationRulesStage } from './templates/destination-rules-stage'
import { getVirtualServiceStage } from './templates/virtual-service-stage'
import { getProxyEvaluationStage } from './templates/proxy-evaluation'

export class SpinnakerConnector {

  private currentStageId = 1

  public createV2Deployment(deployment: Deployment, activeComponents: Component[]): ConnectorResult {
    const pipeline: SpinnakerPipeline = this.buildSpinnakerDeploymentPipeline(deployment, activeComponents)
    return { status: 'SUCCEEDED' }
  }

  public buildSpinnakerDeploymentPipeline(deployment: Deployment, activeComponents: Component[]): SpinnakerPipeline {
    return {
      application: `app-${deployment.cdConfiguration.id}`,
      name: `${deployment.id}`,
      expectedArtifacts: this.getExpectedArtifacts(deployment),
      stages: this.getStages(deployment, activeComponents)
    }
  }

  private getExpectedArtifacts(deployment: Deployment): ExpectedArtifact[] {
    const expectedArtifacts: ExpectedArtifact[] = []
    deployment.components?.forEach(component => {
      expectedArtifacts.push(getHelmTemplateObject(component, deployment.cdConfiguration))
      expectedArtifacts.push(getHelmValueObject(component, deployment.cdConfiguration))
    })
    return expectedArtifacts
  }

  private getStages(deployment: Deployment, activeComponents: Component[]): Stage[] {
    this.currentStageId = 1
    return [
      ...this.getDeploymentStages(deployment),
      ...this.getProxyDeploymentStages(deployment, activeComponents),
      ...this.getDeploymentsEvaluationStage(deployment.components),
      ...this.getRollbackDeploymentsStage(deployment),
      ...this.getProxyDeploymentsEvaluationStage(deployment.components),
      ...this.getDeleteUnusedDeploymentsStage(deployment, activeComponents),
      ...this.getFailureWebhookStage(deployment),
      ...this.getSuccessWebhookStage(deployment)
    ]
  }

  private getDeploymentStages(deployment: Deployment): Stage[] {
    const deploymentStages: Stage[] = []
    deployment.components?.forEach(component => {
      deploymentStages.push(getBakeStage(component, this.currentStageId++))
      deploymentStages.push(getDeploymentStage(component, deployment.cdConfiguration, this.currentStageId++))
    })
    return deploymentStages
  }

  private getProxyDeploymentStages(deployment: Deployment, activeComponents: Component[]): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const proxyStages: Stage[] = []
    const evalStageId: number = deployment.components.length * 4 + 1
    deployment.components.forEach(component => {
      const activeByName: Component[] = this.getActiveComponentsByName(activeComponents, component.name)
      proxyStages.push(getDestinationRulesStage(component, deployment, activeByName, this.currentStageId++, evalStageId))
      proxyStages.push(getVirtualServiceStage(component, deployment, activeByName, this.currentStageId++))
    })
    return proxyStages
  }

  private getDeploymentsEvaluationStage(components: Component[] | undefined): Stage[] {
    return components && components.length ?
      [getDeploymentsEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getRollbackDeploymentsStage(deployment: Deployment): Stage[] {
    const stages: Stage[] = []
    const evalStageId: number = this.currentStageId - 1
    deployment.components?.forEach(component => {
      stages.push(getRollbackDeploymentsStage(component, deployment.cdConfiguration, this.currentStageId++, evalStageId))
    })
    return stages
  }

  private getProxyDeploymentsEvaluationStage(components: Component[] | undefined): Stage[] {
    return components && components.length ?
      [getProxyEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getDeleteUnusedDeploymentsStage(deployment: Deployment, activeComponents: Component[]): Stage[] {
    const stages: Stage[] = []
    const evalStageId: number = this.currentStageId - 1
    deployment?.components?.forEach(component => {
      const activeByName: Component[] = this.getActiveComponentsByName(activeComponents, component.name)
      const unusedComponent: Component | undefined = this.getSameCircleActiveComponent(activeByName, deployment.circleId)
      if (unusedComponent) {
        stages.push(getDeleteUnusedStage(unusedComponent, deployment.cdConfiguration, this.currentStageId++, evalStageId))
      }
    })
    return stages
  }

  private getFailureWebhookStage(deployment: Deployment): Stage[] {
    return [getFailureWebhookStage(deployment, this.currentStageId++)]
  }

  private getSuccessWebhookStage(deployment: Deployment): Stage[] {
    return [getSuccessWebhookStage(deployment, this.currentStageId++)]
  }

  private getActiveComponentsByName(activeComponents: Component[], name: string): Component[] {
    return activeComponents.filter(component => component.name === name)
  }

  private getSameCircleActiveComponent(activeComponents: Component[], circleId: string | null): Component | undefined {
    return activeComponents
      .find(component => component.deployment && component.deployment.circleId === circleId)
  }
}