import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn
} from 'typeorm'
import { ReadCdConfigurationDto } from '../dto'
import * as uuidv4 from 'uuid/v4'
import { CdConfigurationDataEntity } from './'

@Entity('cd_configurations')
export class CdConfigurationEntity extends BaseEntity {

    @PrimaryColumn({ name: 'id' })
    public id: string

    @Column({ name: 'name' })
    public name: string

    @Column({ type: 'text', name: 'configuration_data' })
    public configurationData: CdConfigurationDataEntity

    @Column({ name: 'user_id' })
    public authorId: string

    @Column({ name: 'application_id' })
    public applicationId: string

    @Column({ name: 'created_at'})
    public createdAt: Date

    constructor(
        name: string,
        configurationData: CdConfigurationDataEntity,
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

    public toReadDto(): ReadCdConfigurationDto {
        return new ReadCdConfigurationDto(
            this.id,
            this.name,
            this.authorId,
            this.applicationId,
            this.createdAt
        )
    }
}
