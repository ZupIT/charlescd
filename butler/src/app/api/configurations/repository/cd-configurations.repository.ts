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
    EntityRepository,
    InsertResult,
    Repository
} from 'typeorm'
import { CdConfigurationEntity, } from '../entity'
import { plainToClass } from 'class-transformer'
import { AppConstants } from '../../../core/constants'
import { ICdConfigurationData } from '../interfaces'
import { mapValues } from 'lodash'
import { NotFoundException } from '@nestjs/common'

@EntityRepository(CdConfigurationEntity)
export class CdConfigurationsRepository extends Repository<CdConfigurationEntity> {

    public async saveEncrypted(
        cdConfig: CdConfigurationEntity
    ): Promise<CdConfigurationEntity> {

        const queryResult: InsertResult = await this.createQueryBuilder('cd_configurations')
            .insert()
            .values({
                id: cdConfig.id,
                type: cdConfig.type,
                configurationData: this.setConfigurationData(cdConfig.configurationData),
                name: cdConfig.name,
                authorId: cdConfig.authorId,
                workspaceId: cdConfig.workspaceId
            })
            .returning('id, type, name, user_id, workspace_id, created_at')
            .execute()

        return plainToClass(CdConfigurationEntity, queryResult.generatedMaps[0])
    }

    public async findAllByWorkspaceId(workspaceId: string): Promise<CdConfigurationEntity[]> {

        const queryResult: Record<string, unknown>[] = await this.createQueryBuilder('cd_configurations')
            .select('id, type, name')
            .addSelect('user_id', 'authorId')
            .addSelect('workspace_id', 'workspaceId')
            .addSelect('created_at', 'createdAt')
            .where('cd_configurations.workspace_id = :workspaceId', { workspaceId })
            .getRawMany()

        return queryResult.map(configuration => plainToClass(CdConfigurationEntity, configuration))
    }

    public async findDecrypted(id: string): Promise<CdConfigurationEntity> {

        const queryResult: { configurationData: string } = await this.createQueryBuilder('cd_configurations')
            .select('id, type, name')
            .addSelect('user_id', 'authorId')
            .addSelect('workspace_id', 'workspaceId')
            .addSelect('created_at', 'createdAt')
            .addSelect(`PGP_SYM_DECRYPT(configuration_data::bytea, '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`, 'configurationData')
            .where('cd_configurations.id = :id', { id })
            .getRawOne()

        if (!queryResult) {
            throw new NotFoundException(`CdConfiguration not found - id: ${id}`)
        }

        if (queryResult.configurationData) {
            queryResult.configurationData = JSON.parse(queryResult.configurationData)
        }

        return plainToClass(CdConfigurationEntity, queryResult)
    }

    private setConfigurationData(configurationData: ICdConfigurationData): () => string {
        const stringConfigurationData = JSON.stringify(
            this.trimObject(configurationData)
        )
        return () : string => `PGP_SYM_ENCRYPT('${stringConfigurationData}', '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`
    }

    private trimObject(configurationData: ICdConfigurationData) {
        return mapValues(configurationData, (value) => {
            if (typeof value === 'string') {
                return value.trim()
            }
            return value
        })
    }
}
