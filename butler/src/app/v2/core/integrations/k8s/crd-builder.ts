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

import { Component, Deployment } from '../../../api/deployments/interfaces'
import { CharlesDeployment, CharlesDeploymentComponent } from './interfaces/charles-deployment.interface'
import { DeploymentComponent } from '../../../api/deployments/interfaces/deployment.interface'
import {
  CharlesRouteComponent,
  CharlesRoutes
} from './interfaces/charles-routes.interface'

export class CrdBuilder {

  public static buildDeploymentCrdManifest(deployment: Deployment): CharlesDeployment {
    return {
      apiVersion: 'charlescd.io/v1',
      kind: 'CharlesDeployment',
      metadata: {
        name: deployment.circleId
      },
      spec: {
        deploymentId: deployment.id,
        circleId: deployment.circleId,
        components: deployment.components ?
          CrdBuilder.getDeploymentCrdComponents(deployment.components) :
          []
      }
    }
  }

  public static buildRoutingCrdManifest(cdConfigurationId: string, activeComponents: Component[]): CharlesRoutes {
    return {
      apiVersion: 'charlescd.io/v1',
      kind: 'CharlesRoutes',
      metadata: {
        name: cdConfigurationId
      },
      spec: {
        components: CrdBuilder.getRoutingCrdComponents(activeComponents)
      }
    }
  }

  private static getDeploymentCrdComponents(components: DeploymentComponent[]): CharlesDeploymentComponent[] {
    return components.map(component => ({
      name: component.name,
      chart: component.helmUrl,
      tag: component.imageTag
    }))
  }

  private static getRoutingCrdComponents(activeComponents: Component[]): CharlesRouteComponent[] { // TODO create query with this logic
    const charlesRouteComponents: CharlesRouteComponent[] = []
    activeComponents.forEach(component => {
      if (charlesRouteComponents.find(c => c.name === component.name)) {
        return
      }
      const activeByName = activeComponents.filter(c => c.name === component.name)
      charlesRouteComponents.push({
        name: component.name,
        circles: activeByName.map(c => ({ id: c.deployment.circleId, tag: c.imageTag, default: c.deployment.defaultCircle }))
      })
    })
    return charlesRouteComponents
  }
}