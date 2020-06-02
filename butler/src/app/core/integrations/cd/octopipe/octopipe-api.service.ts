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

import {
    HttpService,
    Inject,
    Injectable
} from '@nestjs/common'
import { IoCTokensConstants } from '../../../constants/ioc'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { IOctopipePayload } from '../../octopipe/interfaces/octopipe-payload.interface'

@Injectable()
export class OctopipeApiService {

    constructor(
        private readonly httpService: HttpService,
        @Inject(IoCTokensConstants.ENV_CONFIGURATION)
        private readonly envConfiguration: IEnvConfiguration
    ) {}

    public deploy(octopipeConfiguration: IOctopipePayload): Observable<AxiosResponse> {
        return this.httpService.post(
            `${this.envConfiguration.octopipeUrl}/api/v1/pipelines`,
            octopipeConfiguration,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    }
}
