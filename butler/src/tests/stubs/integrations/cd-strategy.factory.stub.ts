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

import { CdTypeEnum } from '../../../app/v1/api/configurations/enums'
import { SpinnakerService } from '../../../app/v1/core/integrations/cd/spinnaker'
import { OctopipeService } from '../../../app/v1/core/integrations/cd/octopipe'

const serviceStub = {
    createDeployment: () => Promise.resolve(undefined),
    createIstioDeployment: () => Promise.resolve(undefined),
    createUndeployment: () => Promise.resolve(undefined)
}
export class CdStrategyFactoryStub {

    public create(type: CdTypeEnum): SpinnakerService | OctopipeService {
        return serviceStub as any
    }
}
