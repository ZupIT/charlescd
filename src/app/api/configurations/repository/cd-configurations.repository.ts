import {
    EntityRepository,
    InsertResult,
    Repository
} from 'typeorm'
import {
    CdConfigurationEntity,
} from '../entity'
import { plainToClass } from 'class-transformer'
import { AppConstants } from '../../../core/constants'
import { ICdConfigurationData } from '../interfaces'

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
                configurationData: () =>
                    `PGP_SYM_ENCRYPT('${JSON.stringify(cdConfig.configurationData)}', '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`,
                name: cdConfig.name,
                authorId: cdConfig.authorId,
                applicationId: cdConfig.applicationId
            })
            .returning('id, name, user_id, application_id, created_at')
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

    public async findDecrypted(id: string): Promise<ICdConfigurationData> {

        const queryResult: { configurationData: string } = await this.createQueryBuilder('cd_configurations')
            .select(`PGP_SYM_DECRYPT(configuration_data::bytea, '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`, 'configurationData')
            .where('cd_configurations.id = :id', { id })
            .getRawOne()

        return queryResult ? JSON.parse(queryResult.configurationData) : undefined
    }
}
