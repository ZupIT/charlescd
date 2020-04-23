import {
    EntityRepository,
    InsertResult,
    Repository
} from 'typeorm'
import { CdConfigurationEntity, } from '../entity'
import { plainToClass } from 'class-transformer'
import { AppConstants } from '../../../core/constants'

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
                workspaceId: cdConfig.workspaceId
            })
            .returning('id, type, name, user_id, workspace_id, created_at')
            .execute()

        return plainToClass(CdConfigurationEntity, queryResult.generatedMaps[0])
    }

    public async findAllByWorkspaceId(workspaceId: string): Promise<CdConfigurationEntity[]> {

        const queryResult: object[] = await this.createQueryBuilder('cd_configurations')
            .select('id, type, name')
            .addSelect('user_id', 'authorId')
            .addSelect('workspace_id', 'workspaceId')
            .addSelect('created_at', 'createdAt')
            .where('cd_configurations.workspace_id = :workspaceId', { workspaceId })
            .getRawMany()

        return queryResult.map(configuration => plainToClass(CdConfigurationEntity, configuration))
    }

    public async findDecrypted(id: string): Promise<CdConfigurationEntity> {

        const queryResult = await this.createQueryBuilder('cd_configurations')
            .select('id, type, name')
            .addSelect('user_id', 'authorId')
            .addSelect('workspace_id', 'workspaceId')
            .addSelect('created_at', 'createdAt')
            .addSelect(`PGP_SYM_DECRYPT(configuration_data::bytea, '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`, 'configurationData')
            .where('cd_configurations.id = :id', { id })
            .getRawOne()

        if (queryResult && queryResult.configurationData) {
            queryResult.configurationData = JSON.parse(queryResult.configurationData)
        }

        return queryResult ? plainToClass(CdConfigurationEntity, queryResult) : undefined
    }
}
