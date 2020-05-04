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
                applicationId: cdConfig.applicationId
            })
            .returning('id, type, name, user_id, application_id, created_at')
            .execute()

        return plainToClass(CdConfigurationEntity, queryResult.generatedMaps[0])
    }

    public async findAllByApplicationId(applicationId: string): Promise<CdConfigurationEntity[]> {

        const queryResult: object[] = await this.createQueryBuilder('cd_configurations')
            .select('id, type, name')
            .addSelect('user_id', 'authorId')
            .addSelect('application_id', 'applicationId')
            .addSelect('created_at', 'createdAt')
            .where('cd_configurations.application_id = :applicationId', { applicationId })
            .getRawMany()

        return queryResult.map(configuration => plainToClass(CdConfigurationEntity, configuration))
    }

    public async findDecrypted(id: string): Promise<CdConfigurationEntity> {

        const queryResult: { configurationData: string } = await this.createQueryBuilder('cd_configurations')
            .select('id, type, name')
            .addSelect('user_id', 'authorId')
            .addSelect('application_id', 'applicationId')
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
        return () => `PGP_SYM_ENCRYPT('${stringConfigurationData}', '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`
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
