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

import { SpinnakerPipeline } from './interfaces'
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
} from './templates/deployment'
import { getDestinationRulesStage } from './templates/deployment/destination-rules-stage'
import { getVirtualServiceStage } from './templates/deployment/virtual-service-stage'
import { getProxyEvaluationStage } from './templates/deployment/proxy-evaluation'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import {
  getUndeploymentDestinationRulesStage, getUndeploymentEmptyVirtualServiceStage, getUndeploymentFailureWebhookStage,
  getUndeploymentProxyEvaluationStage, getUndeploymentsDeleteUnusedStage, getUndeploymentsSuccessWebhookStage,
  getUndeploymentVirtualServiceStage
} from './templates/undeployment'
import { ConnectorConfiguration } from './connector'

export class SpinnakerPipelineBuilder {

  private currentStageId = 1

  public buildSpinnakerDeploymentPipeline(deployment: Deployment, activeComponents: Component[], configuration: ConnectorConfiguration): SpinnakerPipeline {
    return {
      application: `app-${deployment.cdConfiguration.id}`,
      name: `${deployment.id}`,
      expectedArtifacts: this.getExpectedArtifacts(deployment),
      stages: this.getSpinnakerDeploymentStages(deployment, activeComponents, configuration)
    }
  }

  public buildSpinnakerUndeploymentPipeline(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): SpinnakerPipeline {

    return {
      application: `app-${deployment.cdConfiguration.id}`,
      name: `${deployment.id}`,
      expectedArtifacts: [],
      stages: this.getSpinnakerUndeploymentStages(deployment, activeComponents, configuration)
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

  private getSpinnakerDeploymentStages(deployment: Deployment, activeComponents: Component[], configuration: ConnectorConfiguration): Stage[] {
    this.currentStageId = 1
    return [
      ...this.getDeploymentStages(deployment),
      ...this.getProxyDeploymentStages(deployment, activeComponents),
      ...this.getDeploymentsEvaluationStage(deployment.components),
      ...this.getRollbackDeploymentsStage(deployment),
      ...this.getProxyDeploymentsEvaluationStage(deployment.components),
      ...this.getDeleteUnusedDeploymentsStage(deployment, activeComponents),
      ...this.getFailureWebhookStage(deployment, configuration),
      ...this.getSuccessWebhookStage(deployment, configuration)
    ]
  }

  private getSpinnakerUndeploymentStages(deployment: Deployment, activeComponents: Component[], configuration: ConnectorConfiguration): Stage[] {
    this.currentStageId = 1
    return [
      ...this.getProxyUndeploymentStages(deployment, activeComponents),
      ...this.getProxyUndeploymentsEvaluationStage(deployment.components),
      ...this.getUndeploymentFailureWebhookStage(deployment, configuration),
      ...this.getUndeploymentSuccessWebhookStage(deployment, configuration),
      ...this.getUndeploymentDeleteUnusedDeploymentsStage(deployment, activeComponents)
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

  private getProxyUndeploymentStages(deployment: Deployment, activeComponents: Component[]): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const proxyStages: Stage[] = []
    deployment.components.forEach(component => {
      const activeByName: Component[] = this.getActiveComponentsByName(activeComponents, component.name)
      proxyStages.push(getUndeploymentDestinationRulesStage(component, deployment, activeByName, this.currentStageId++))
      proxyStages.push(activeByName.length > 1 ?
        getUndeploymentVirtualServiceStage(component, deployment, activeByName, this.currentStageId++) :
        getUndeploymentEmptyVirtualServiceStage(component, deployment, this.currentStageId++)
      )
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

  private getProxyUndeploymentsEvaluationStage(components: Component[] | undefined): Stage[] {
    return components && components.length ?
      [getUndeploymentProxyEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getDeleteUnusedDeploymentsStage(deployment: Deployment, activeComponents: Component[]): Stage[] {
    const stages: Stage[] = []
    const evalStageId: number = this.currentStageId - 1
    deployment?.components?.forEach(component => {
      const unusedComponent: Component | undefined = this.getUnusedComponent(activeComponents, component, deployment.circleId)
      if (unusedComponent) {
        stages.push(getDeleteUnusedStage(unusedComponent, deployment.cdConfiguration, this.currentStageId++, evalStageId))
      }
    })
    return stages
  }

  private getUndeploymentDeleteUnusedDeploymentsStage(deployment: Deployment, activeComponents: Component[]): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const stages: Stage[] = []
    const evalStageId: number = deployment.components.length * 2 + 1
    deployment.components.forEach(component => {
      const unusedComponent: Component | undefined = this.getUndeploymentUnusedComponent(activeComponents, component)
      if (unusedComponent) {
        stages.push(getUndeploymentsDeleteUnusedStage(unusedComponent, deployment.cdConfiguration, this.currentStageId++, evalStageId))
      }
    })
    return stages
  }

  private getFailureWebhookStage(deployment: Deployment, configuration: ConnectorConfiguration): Stage[] {
    return [getFailureWebhookStage(deployment, this.currentStageId++, configuration)]
  }

  private getSuccessWebhookStage(deployment: Deployment, configuration: ConnectorConfiguration): Stage[] {
    return [getSuccessWebhookStage(deployment, this.currentStageId++, configuration)]
  }

  private getUndeploymentFailureWebhookStage(deployment: Deployment, configuration: ConnectorConfiguration): Stage[] {
    return [getUndeploymentFailureWebhookStage(deployment, this.currentStageId++, configuration)]
  }

  private getUndeploymentSuccessWebhookStage(deployment: Deployment, configuration: ConnectorConfiguration): Stage[] {
    return [getUndeploymentsSuccessWebhookStage(deployment, this.currentStageId++, configuration)]
  }

  private getActiveComponentsByName(activeComponents: Component[], name: string): Component[] {
    return activeComponents.filter(component => component.name === name)
  }

  private getUnusedComponent(activeComponents: Component[], component: Component, circleId: string | null): Component | undefined {
    const activeByName = this.getActiveComponentsByName(activeComponents, component.name)
    const sameCircleComponent = activeByName.find(activeComponent => activeComponent.deployment?.circleId === circleId)
    const sameTagComponents = sameCircleComponent ?
      activeByName.filter(activeComponent => activeComponent.imageTag === sameCircleComponent.imageTag) :
      []

    if (!sameCircleComponent || sameCircleComponent.imageTag === component.imageTag || sameTagComponents.length > 1) {
      return undefined
    }

    return sameCircleComponent
  }

  private getUndeploymentUnusedComponent(activeComponents: Component[], component: Component): Component | undefined {
    const activeByName = this.getActiveComponentsByName(activeComponents, component.name)
    const sameTagComponents = activeByName.filter(activeComponent => activeComponent.imageTag === component.imageTag)

    if (sameTagComponents.length > 1) {
      return undefined
    }

    return component
  }
}
