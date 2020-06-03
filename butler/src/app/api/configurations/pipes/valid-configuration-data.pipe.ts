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
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common'
import { CreateCdConfigurationDto } from '../dto'
import { CdTypeEnum } from '../enums'
import {
    validate,
    ValidationError
} from 'class-validator'
import { OctopipeConfigurationData } from '../interfaces'

@Injectable()
export class ValidConfigurationDataPipe implements PipeTransform {

    public async transform(createCdConfigurationDto: CreateCdConfigurationDto): Promise<CreateCdConfigurationDto> {

        if (createCdConfigurationDto.type === CdTypeEnum.SPINNAKER) {
            const errors: ValidationError[] = await validate('spinnakerConfigurationDataSchema', createCdConfigurationDto.configurationData)
            if (errors.length) {
                throw new BadRequestException(errors)
            }
        } else if (createCdConfigurationDto.type === CdTypeEnum.OCTOPIPE) {

            const errors: ValidationError[] = await this.validateForProvider(createCdConfigurationDto)

            if (errors.length) {
                throw new BadRequestException(errors)
            }
        } else {
            throw new BadRequestException('Invalid configuration object type')
        }

        return createCdConfigurationDto
    }

    private async validateForProvider(createCdConfigurationDto: CreateCdConfigurationDto): Promise<ValidationError[]> {
        const configData = createCdConfigurationDto.configurationData as OctopipeConfigurationData
        switch (configData.provider) {
            case 'EKS': return await validate('octopipeEKSConfigurationDataSchema', createCdConfigurationDto.configurationData)
            case 'GENERIC': return await validate('octopipeGenericConfigurationDataSchema', createCdConfigurationDto.configurationData)
            case 'DEFAULT': return await validate('octopipeDefaultConfigurationDataSchema', createCdConfigurationDto.configurationData)
            default: throw new BadRequestException('Missing provider, must be EKS, GENERIC or DEFAULT')
        }
    }
}
