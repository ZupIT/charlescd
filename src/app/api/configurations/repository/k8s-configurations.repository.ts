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
        k8sConfiguration: K8sConfigurationEntity
    ): Promise<any> {

        const queryResult: InsertResult = await this.createQueryBuilder('k8s_configurations')
            .insert()
            .values({
                id: k8sConfiguration.id,
                name: k8sConfiguration.name,
                configurationData: () => `PGP_SYM_ENCRYPT('${JSON.stringify(k8sConfiguration.configurationData)}', '${AppConstants.ENCRYPTION_KEY}')`,
                authorId: k8sConfiguration.authorId,
                applicationId: k8sConfiguration.applicationId,
                moduleId: k8sConfiguration.moduleId,
            })
            .returning('id, name, user_id, application_id, module_id, created_at')
            .execute()

        return plainToClass(K8sConfigurationEntity, queryResult.generatedMaps[0])
    }

    public async findAll(): Promise<K8sConfigurationEntity[]> {

        const queryResult: object[] = await this.createQueryBuilder('k8s_configurations')
            .select('id, name')
            .addSelect('user_id', 'authorId')
            .addSelect('application_id', 'applicationId')
            .addSelect('module_id', 'moduleId')
            .addSelect('created_at', 'createdAt')
            .getRawMany()

        return queryResult.map(configuration => plainToClass(K8sConfigurationEntity, configuration))
    }

    public async findDecryptedDataByModuleId(moduleId: string): Promise<K8sConfigurationDataEntity> {
        const queryResult: { configurationData: string } = await this.createQueryBuilder('k8s_configurations')
            .select(`PGP_SYM_DECRYPT(configuration_data::bytea, '${AppConstants.ENCRYPTION_KEY}')`, 'configurationData')
            .where('k8s_configurations.module_id = :moduleId', { moduleId })
            .getRawOne()

        return queryResult ? plainToClass(K8sConfigurationDataEntity, JSON.parse(queryResult.configurationData)) : undefined
    }
}
