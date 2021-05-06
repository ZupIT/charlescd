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
  CharlesCircle,
  CharlesRoutes
} from './interfaces/charles-routes.interface'
import { uniqBy } from 'lodash'
import {AppConstants} from "../../constants";

export class CrdBuilder {

  public static buildDeploymentCrdManifest(deployment: Deployment, namespace: string): CharlesDeployment {
    return {
      apiVersion: 'charlescd.io/v1',
      kind: AppConstants.CHARLES_CUSTOM_RESOURCE_DEPLOYMENT_KIND,
      metadata: {
        name: deployment.circleId,
        namespace: namespace
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

  public static buildRoutingCrdManifest(activeComponents: Component[], namespace: string): CharlesRoutes {
    return {
      apiVersion: 'charlescd.io/v1',
      kind: AppConstants.CHARLES_CUSTOM_RESOURCE_ROUTES_KIND,
      metadata: {
        name: `${namespace}-routes`,
        namespace: namespace
      },
      spec: {
        circles: CrdBuilder.getRoutingCrdComponents(activeComponents)
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

  private static getRoutingCrdComponents(activeComponents: Component[]): CharlesCircle[] {
    const deployments = uniqBy(activeComponents.map(c => c.deployment), 'id')

    return deployments.map(d => {
      const deploymentComponents = activeComponents.filter(c => d.id === c.deployment.id)

      return {
        id: d.circleId,
        default: d.defaultCircle,
        components: deploymentComponents.map(c => {
          return {
            name: c.name,
            tag: c.imageTag
          }
        })
      }
    })
  }
}
