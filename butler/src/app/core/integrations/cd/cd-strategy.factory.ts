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
import { CdTypeEnum } from '../../../api/configurations/enums'
import { SpinnakerService } from './spinnaker'
import { OctopipeService } from './octopipe'
import { ICdServiceStrategy } from './interfaces'
import { ConsoleLoggerService } from '../../logs/console'

@Injectable()
export class CdStrategyFactory {

    constructor(
        private readonly spinnakerService: SpinnakerService,
        private readonly octopipeService: OctopipeService,
        private readonly consoleLoggerService: ConsoleLoggerService
    ) {}

    public create(type: CdTypeEnum): ICdServiceStrategy {

        switch (type) {
            case CdTypeEnum.SPINNAKER:
                return this.spinnakerService
            case CdTypeEnum.OCTOPIPE:
                return this.octopipeService
            default:
                this.consoleLoggerService.error('ERROR:INVALID_CD_TYPE_VALUE', type)
                throw new Error('invalid cd type value')

        }
    }
}
