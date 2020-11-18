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
import { DeploymentTemplateUtils } from './utils/deployment-template.utils'
import { UndeploymentTemplateUtils } from './utils/undeployment-template.utils'
import { ConnectorConfiguration } from '../interfaces/connector-configuration.interface'
import { DeploymentUtils } from '../utils/deployment.utils'
import { DeploymentComponent } from '../../../api/deployments/interfaces/deployment.interface'

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
      ...this.getProxyDeploymentsEvaluationStage(deployment.components),
      ...this.getRollbackDeploymentsStage(deployment, activeComponents),
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
      ...this.getUndeploymentDeleteUnusedDeploymentsStage(deployment),
      ...this.getUndeploymentFailureWebhookStage(deployment, configuration),
      ...this.getUndeploymentSuccessWebhookStage(deployment, configuration)
    ]
  }

  private getDeploymentStages(deployment: Deployment): Stage[] {
    const deploymentStages: Stage[] = []
    deployment.components?.forEach(component => {
      deploymentStages.push(getBakeStage(component, deployment.cdConfiguration, this.currentStageId++, deployment.circleId))
      deploymentStages.push(getDeploymentStage(component, deployment.cdConfiguration, this.currentStageId++))
    })
    return deploymentStages
  }

  private getProxyDeploymentStages(deployment: Deployment, activeComponents: Component[]): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const proxyStages: Stage[] = []
    const evalStageId: number = DeploymentTemplateUtils.getDeploymentEvalStageId(deployment.components)
    deployment.components.forEach(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
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
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      proxyStages.push(getUndeploymentDestinationRulesStage(component, deployment, activeByName, this.currentStageId++))
      proxyStages.push(activeByName.length > 1 ?
        getUndeploymentVirtualServiceStage(component, deployment, activeByName, this.currentStageId++) :
        getUndeploymentEmptyVirtualServiceStage(component, deployment, this.currentStageId++)
      )
    })
    return proxyStages
  }

  private getDeploymentsEvaluationStage(components: DeploymentComponent[] | undefined): Stage[] {
    return components && components.length ?
      [getDeploymentsEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getRollbackDeploymentsStage(deployment: Deployment, activeComponents: Component[]): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const stages: Stage[] = []
    const evalStageId: number = DeploymentTemplateUtils.getDeploymentEvalStageId(deployment.components)
    deployment.components?.forEach(component => {
      const activeSameCircleSameTag = DeploymentUtils.getActiveSameCircleTagComponent(activeComponents, component, deployment.circleId)
      if (!activeSameCircleSameTag) {
        stages.push(getRollbackDeploymentsStage(component, deployment.cdConfiguration, this.currentStageId++, evalStageId, deployment.circleId))
      }
    })
    return stages
  }

  private getProxyDeploymentsEvaluationStage(components: DeploymentComponent[] | undefined): Stage[] {
    return components && components.length ?
      [getProxyEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getProxyUndeploymentsEvaluationStage(components: DeploymentComponent[] | undefined): Stage[] {
    return components && components.length ?
      [getUndeploymentProxyEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getDeleteUnusedDeploymentsStage(deployment: Deployment, activeComponents: Component[]): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const stages: Stage[] = []
    const evalStageId: number = DeploymentTemplateUtils.getProxyEvalStageId(deployment.components)
    deployment.components.forEach(component => {
      const unusedComponent: Component | undefined = DeploymentUtils.getUnusedComponent(activeComponents, component, deployment.circleId)
      if (unusedComponent) {
        stages.push(getDeleteUnusedStage(unusedComponent, deployment.cdConfiguration, this.currentStageId++, evalStageId, deployment.circleId))
      }
    })
    return stages
  }

  private getUndeploymentDeleteUnusedDeploymentsStage(deployment: Deployment): Stage[] {
    if (!deployment?.components) {
      return []
    }
    const stages: Stage[] = []
    const evalStageId: number = UndeploymentTemplateUtils.getProxyEvalStageId(deployment.components)
    deployment.components.forEach(component => {
      stages.push(getUndeploymentsDeleteUnusedStage(component, deployment.cdConfiguration, this.currentStageId++, evalStageId, deployment.circleId))
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
}
