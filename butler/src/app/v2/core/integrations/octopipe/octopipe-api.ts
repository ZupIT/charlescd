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

import { OctopipeDeploymentRequest } from './interfaces/octopipe-deployment.interface'
import { OctopipeUndeploymentRequest } from './interfaces/octopipe-undeployment.interface'
import { HttpService, Inject, Injectable } from '@nestjs/common'
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'

@Injectable()
export class OctopipeApi {

  constructor(
    private readonly httpService: HttpService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {}

  public deploy(deployment: OctopipeDeploymentRequest, incomingCircleId: string | null): Observable<AxiosResponse> {
    return this.httpService.post(
      `${this.envConfiguration.octopipeUrl}/api/v2/deployments`,
      deployment,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-circle-id': incomingCircleId
        }
      }
    )
  }

  public undeploy(undeployment: OctopipeUndeploymentRequest, incomingCircleId: string | null): Observable<AxiosResponse> {
    return this.httpService.post(
      `${this.envConfiguration.octopipeUrl}/api/v2/undeployments`,
      undeployment,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-circle-id': incomingCircleId
        }
      }
    )
  }
}
