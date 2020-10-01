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
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import { CdConnector } from '../interfaces/cd-connector.interface'
import { ConnectorConfiguration } from '../interfaces/connector-configuration.interface'
import { ConnectorResult, ConnectorResultError } from '../spinnaker/interfaces'
import { OctopipeApi } from './octopipe-api'
import { OctopipeDeployment } from './interfaces/octopipe-deployment.interface'
import { OctopipeUndeployment } from './interfaces/octopipe-undeployment.interface'
import { OctopipeRequestBuilder } from './request-builder'

@Injectable()
export class OctopipeConnector implements CdConnector {

  constructor(
    private consoleLoggerService: ConsoleLoggerService,
    private octopipeApi: OctopipeApi
  ) {}

  public async createDeployment(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<ConnectorResult | ConnectorResultError> {

    try {
      const octopipeDeployment =
        new OctopipeRequestBuilder().buildDeploymentRequest(deployment, activeComponents, configuration)
      await this.octopipeApi.deploy(octopipeDeployment, configuration.incomingCircleId).toPromise()
      return { status: 'SUCCEEDED' }
    } catch(error) {
      return { status: 'ERROR', error: error }
    }
  }

  public async createUndeployment(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<ConnectorResult | ConnectorResultError> {

    try {
      const octopipeUndeployment =
        new OctopipeRequestBuilder().buildUndeploymentRequest(deployment, activeComponents, configuration)
      await this.octopipeApi.undeploy(octopipeUndeployment, configuration.incomingCircleId).toPromise()
      return { status: 'SUCCEEDED' }
    } catch(error) {
      return { status: 'ERROR', error: error }
    }
  }
}
