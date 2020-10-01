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

import { OctopipeDeployment } from './interfaces/octopipe-deployment.interface'
import { OctopipeUndeployment } from './interfaces/octopipe-undeployment.interface'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import { ConnectorConfiguration } from '../interfaces/connector-configuration.interface'
import { OctopipeConfigurationData } from '../../../../v1/api/configurations/interfaces'
import { UrlUtils } from '../../utils/url.utils'

export class OctopipeRequestBuilder {

  public buildDeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): OctopipeDeployment {

    return {
      namespace: (deployment.cdConfiguration?.configurationData as OctopipeConfigurationData).namespace,
      deployments: [], // TODO fill this
      proxyDeployments: [], // TODO fill this
      callbackUrl: UrlUtils.getDeploymentNotificationUrl(configuration.executionId),
      clusterConfig: null // TODO fill this
    }
  }

  public buildUndeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): OctopipeUndeployment {

    return {
      namespace: (deployment.cdConfiguration?.configurationData as OctopipeConfigurationData).namespace,
      undeployments: [], // TODO fill this
      proxyDeployments: [], // TODO fill this
      callbackUrl: UrlUtils.getDeploymentNotificationUrl(configuration.executionId),
      clusterConfig: null // TODO fill this
    }
  }
}