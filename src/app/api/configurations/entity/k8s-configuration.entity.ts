import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn
} from 'typeorm'
import { ReadK8sConfigurationDto } from '../dto'
import * as uuidv4 from 'uuid/v4'
import { plainToClass } from 'class-transformer'
import { K8sConfigurationDataEntity } from './'

@Entity()
export class K8sConfigurationEntity {

    @PrimaryColumn({ name: 'id' })
    public id: string

    @Column({ name: 'name' })
    public name: string

    @Column({
        type: 'text',
        name: 'configuration_data',
        transformer: {
            from: configurationData => plainToClass(K8sConfigurationDataEntity, configurationData),
            to: configurationData => configurationData
        }
    })
    public configurationData: K8sConfigurationDataEntity

    @Column({ name: 'user_id' })
    public authorId: string

    @Column({ name: 'application_id' })
    public applicationId: string

    @CreateDateColumn({ name: 'created_at'})
    public createdAt: Date

    @Column({ name: 'module_id' })
    public moduleId: string

    constructor(
        name: string,
        configurationData: K8sConfigurationDataEntity,
        authorId: string,
        applicationId: string,
        moduleId: string
    ) {
        this.id = uuidv4()
        this.name = name
        this.configurationData = configurationData
        this.authorId = authorId
        this.applicationId = applicationId
        this.moduleId = moduleId
    }

    public toReadDto(): ReadK8sConfigurationDto {
        return new ReadK8sConfigurationDto(
            this.id,
            this.name,
            this.authorId,
            this.applicationId,
            this.createdAt,
            this.moduleId
        )
    }
}
