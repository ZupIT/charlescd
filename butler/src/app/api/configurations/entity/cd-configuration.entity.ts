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
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn
} from 'typeorm'
import { ReadCdConfigurationDto } from '../dto'
import { v4 as uuidv4 } from 'uuid'
import { ICdConfigurationData } from '../interfaces'
import { CdTypeEnum } from '../enums'

@Entity('cd_configurations')
export class CdConfigurationEntity extends BaseEntity {

    @PrimaryColumn({ name: 'id' })
    public id: string

    @Column({ name: 'type' })
    public type: CdTypeEnum

    @Column({ type: 'text', name: 'configuration_data' })
    public configurationData: ICdConfigurationData

    @Column({ name: 'name' })
    public name: string

    @Column({ name: 'user_id' })
    public authorId: string

    @Column({ name: 'workspace_id' })
    public workspaceId: string

    @Column({ name: 'created_at'})
    public createdAt!: Date

    constructor(
        type: CdTypeEnum,
        configurationData: ICdConfigurationData,
        name: string,
        authorId: string,
        workspaceId: string
    ) {
        super()
        this.id = uuidv4()
        this.type = type
        this.configurationData = configurationData
        this.name = name
        this.authorId = authorId
        this.workspaceId = workspaceId
    }

    public toReadDto(): ReadCdConfigurationDto {
        return new ReadCdConfigurationDto(
            this.id,
            this.name,
            this.authorId,
            this.workspaceId,
            this.createdAt
        )
    }
}
