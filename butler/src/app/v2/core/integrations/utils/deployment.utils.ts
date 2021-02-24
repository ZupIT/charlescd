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
  const sameCircleComponents = activeComponents.filter(c => c.deployment.circleId === deployment.circleId)
  return sameCircleComponents.filter(c => {
    return removedComponents(deployment.components, c) || updatedComponents(deployment.components, c)
  })
}

export const unusedComponentProxy = (deployment: Deployment, activeComponents: Component[]): DeploymentComponent[] => {
  if (componentsToBeRemoved(deployment, activeComponents).length === 0) {
    return []
  }
  const sameCircleComponents = activeComponents.filter(c => c.deployment.circleId === deployment.circleId)

  return sameCircleComponents.filter(c => !deployment.components?.map(dc => dc.name).includes(c.name))
}

const removedComponents = (deploymentComponents: DeploymentComponent[] | undefined, activeComponent: Component) => {
  return !deploymentComponents?.some(dc => isSameName(dc, activeComponent))
}

const updatedComponents = (deploymentComponents: DeploymentComponent[] | undefined, activeComponent: Component) => {
  return deploymentComponents?.some(dc => isSameNameAndDifferentVersion(dc, activeComponent))
}

const isSameNameAndDifferentVersion = (deploymentComponent: DeploymentComponent, activeComponent: Component): boolean => {
  return isSameName(deploymentComponent, activeComponent) && deploymentComponent.imageTag !== activeComponent.imageTag
}

const isSameName = (deploymentComponent: DeploymentComponent, activeComponent: Component): boolean => {
  return deploymentComponent.name === activeComponent.name
}
