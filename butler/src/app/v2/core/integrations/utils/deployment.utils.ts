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

import { Component } from '../../../api/deployments/interfaces'
import { Deployment, DeploymentComponent } from '../../../api/deployments/interfaces/deployment.interface'

const DeploymentUtils = {
  getActiveSameCircleTagComponent: (activeComponents: Component[], component: DeploymentComponent, circleId: string | null): Component | undefined => {
    const activeByName = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
    return activeByName.find(
      activeComponent => activeComponent.imageTag === component.imageTag && activeComponent.deployment?.circleId === circleId
    )
  },

  getActiveComponentsByName: (activeComponents: Component[], name: string): Component[] => {
    return activeComponents.filter(component => component.name === name)
  },

  getUnusedComponent: (activeComponents: Component[], component: DeploymentComponent, circleId: string | null): Component | undefined => {
    const activeByName = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
    const sameCircleComponent = activeByName.find(activeComponent => activeComponent.deployment?.circleId === circleId)

    if (!sameCircleComponent || sameCircleComponent.imageTag === component.imageTag) {
      return undefined
    }

    return sameCircleComponent
  },

  isDistinctAndNotDefault(component: Component, circleId: string): boolean {
    return DeploymentUtils.isDistinctCircle(component, circleId) && !component.deployment.defaultCircle
  },

  isDistinctCircle(component: Component, circleId: string): boolean {
    return component.deployment.circleId !== circleId
  }
}

export { DeploymentUtils }


export const componentsToBeRemoved = (deployment: Deployment, activeComponents: Component[]): DeploymentComponent[] => {
  const circleId = deployment.circleId
  return activeComponents.filter(c => {
    return removedComponents(deployment.components, c, circleId) || updatedComponents(deployment.components, c, circleId)
  })
}

const removedComponents = (deploymentComponents: DeploymentComponent[] | undefined, activeComponent: Component, circleId: string) => {
  return !deploymentComponents?.some(dc => removedConditions(dc, activeComponent, circleId))
}

const updatedComponents = (deploymentComponents: DeploymentComponent[] | undefined, activeComponent: Component, circleId: string) => {
  return deploymentComponents?.some(dc => updatedConditions(dc, activeComponent, circleId))
}

const removedConditions = (deploymentComponent: DeploymentComponent, activeComponent: Component, circleId: string): boolean => {
  return isSameName(deploymentComponent, activeComponent) && isSameCircle(circleId, activeComponent.deployment)
}

const updatedConditions = (deploymentComponent: DeploymentComponent, activeComponent: Component, circleId: string): boolean => {
  return isSameNameAndDifferenteVersion(deploymentComponent, activeComponent) && isSameCircle(circleId, activeComponent.deployment)
}

const isSameNameAndDifferenteVersion = (deploymentComponent: DeploymentComponent, activeComponent: Component): boolean => {
  return isSameName(deploymentComponent, activeComponent) && deploymentComponent.imageTag !== activeComponent.imageTag
}

const isSameName = (deploymentComponent: DeploymentComponent, activeComponent: Component): boolean => {
  return deploymentComponent.name === activeComponent.name
}

const isSameCircle = (circleId: string, deployment: Deployment): boolean => {
  return circleId === deployment.circleId
}
