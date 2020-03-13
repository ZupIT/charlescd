import {
    EntityRepository,
    InsertResult,
    Repository
} from 'typeorm'
import {
    K8sConfigurationDataEntity,
    K8sConfigurationEntity,
} from '../entity'
import { plainToClass } from 'class-transformer'
import { AppConstants } from '../../../core/constants'

@EntityRepository(K8sConfigurationEntity)
export class K8sConfigurationsRepository extends Repository<K8sConfigurationEntity> {

    public async saveEncrypted(
        k8sConfig: K8sConfigurationEntity
    ): Promise<K8sConfigurationEntity> {

        const queryResult: InsertResult = await this.createQueryBuilder('k8s_configurations')
            .insert()
            .values({
                id: k8sConfig.id,
                name: k8sConfig.name,
                configurationData: () =>
                    `PGP_SYM_ENCRYPT('${JSON.stringify(k8sConfig.configurationData)}', '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`,
                authorId: k8sConfig.authorId,
                applicationId: k8sConfig.applicationId
            })
            .returning('id, name, user_id, application_id, created_at')
            .execute()

        return plainToClass(K8sConfigurationEntity, queryResult.generatedMaps[0])
    }

    public async findAllByApplicationId(applicationId: string): Promise<K8sConfigurationEntity[]> {

        const queryResult: object[] = await this.createQueryBuilder('k8s_configurations')
            .select('id, name')
            .addSelect('user_id', 'authorId')
            .addSelect('application_id', 'applicationId')
            .addSelect('created_at', 'createdAt')
            .where('k8s_configurations.application_id = :applicationId', { applicationId })
            .getRawMany()

        return queryResult.map(configuration => plainToClass(K8sConfigurationEntity, configuration))
    }

    public async findDecrypted(id: string): Promise<K8sConfigurationDataEntity> {

        const queryResult: { configurationData: string } = await this.createQueryBuilder('k8s_configurations')
            .select(`PGP_SYM_DECRYPT(configuration_data::bytea, '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')`, 'configurationData')
            .where('k8s_configurations.id = :id', { id })
            .getRawOne()

        return queryResult ? plainToClass(K8sConfigurationDataEntity, JSON.parse(queryResult.configurationData)) : undefined
    }
}
