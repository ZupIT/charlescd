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

import { CdConfigurationEntity } from '../entity'
import { IsDefined, IsNotEmpty } from 'class-validator'
import { CdTypeEnum } from '../enums'
import { ICdConfigurationData } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCdConfigurationDto {

    @ApiProperty({ enum: [CdTypeEnum.SPINNAKER, CdTypeEnum.OCTOPIPE] })
    @IsNotEmpty()
    public readonly type: CdTypeEnum

    @ApiProperty()
    @IsDefined()
    public readonly configurationData: ICdConfigurationData

    @ApiProperty()
    @IsNotEmpty()
    public readonly name: string

    @ApiProperty()
    @IsNotEmpty()
    public readonly authorId: string

    constructor(
        type: CdTypeEnum,
        configurationData: ICdConfigurationData,
        name: string,
        authorId: string
    ) {
        this.type = type
        this.configurationData = configurationData
        this.name = name
        this.authorId = authorId
    }

    public toEntity(workspaceId: string): CdConfigurationEntity {
        return new CdConfigurationEntity(
            this.type,
            this.configurationData,
            this.name,
            this.authorId,
            workspaceId
        )
    }
}
