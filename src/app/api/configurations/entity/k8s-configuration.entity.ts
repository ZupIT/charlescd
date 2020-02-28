import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn
} from 'typeorm'
import { ReadK8sConfigurationDto } from '../dto'
import * as uuidv4 from 'uuid/v4'
import { K8sConfigurationDataEntity } from './'

@Entity('k8s_configurations')
export class K8sConfigurationEntity extends BaseEntity {

    @PrimaryColumn({ name: 'id' })
    public id: string

    @Column({ name: 'name' })
    public name: string

    @Column({ type: 'text', name: 'configuration_data' })
    public configurationData: K8sConfigurationDataEntity

    @Column({ name: 'user_id' })
    public authorId: string

    @Column({ name: 'application_id' })
    public applicationId: string

    @Column({ name: 'created_at'})
    public createdAt: Date

    constructor(
        name: string,
        configurationData: K8sConfigurationDataEntity,
        authorId: string,
        applicationId: string
    ) {
        super()
        this.id = uuidv4()
        this.name = name
        this.configurationData = configurationData
        this.authorId = authorId
        this.applicationId = applicationId
    }

    public toReadDto(): ReadK8sConfigurationDto {
        return new ReadK8sConfigurationDto(
            this.id,
            this.name,
            this.authorId,
            this.applicationId,
            this.createdAt
        )
    }
}
