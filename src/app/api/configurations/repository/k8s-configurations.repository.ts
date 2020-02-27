import {
    EntityRepository,
    Repository
} from 'typeorm'
import {
    K8sConfigurationEntity,
} from '../entity'

@EntityRepository(K8sConfigurationEntity)
export class K8sConfigurationsRepository extends Repository<K8sConfigurationEntity> {

    public async saveEncrypted(k8sConfiguration: K8sConfigurationEntity): Promise<K8sConfigurationEntity> {
        return await this.manager.query('')
    }

    public async findDecrypted(id: string): Promise<K8sConfigurationEntity> {
        return await this.manager.query('')
    }
}
