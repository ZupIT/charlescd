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

const DeploymentUtils = {
  getActiveSameCircleTagComponent: (activeComponents: Component[], component: Component, circleId: string | null): Component | undefined => {
    const activeByName = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
    return activeByName.find(
      activeComponent => activeComponent.imageTag === component.imageTag && activeComponent.deployment?.circleId === circleId
    )
  },

  getActiveComponentsByName: (activeComponents: Component[], name: string): Component[] => {
    return activeComponents.filter(component => component.name === name)
  },

  getUnusedComponent: (activeComponents: Component[], component: Component, circleId: string | null): Component | undefined => {
    const activeByName = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
    const sameCircleComponent = activeByName.find(activeComponent => activeComponent.deployment?.circleId === circleId)

    if (!sameCircleComponent || sameCircleComponent.imageTag === component.imageTag) {
      return undefined
    }

    return sameCircleComponent
  }
}

export { DeploymentUtils }
