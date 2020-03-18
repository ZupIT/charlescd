import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn
} from 'typeorm'
import { ReadCdConfigurationDto } from '../dto'
import * as uuidv4 from 'uuid/v4'
import { ICdConfigurationData } from '../interfaces'
import { CdTypeEnum } from '../enums'

@Entity('cd_configurations')
export class CdConfigurationEntity extends BaseEntity {

    @PrimaryColumn({ name: 'id' })
    public id: string

    @Column({ name: 'type' })
    public type: CdTypeEnum

    @Column({ type: 'text', name: 'configuration_data' })
    public configurationData: ICdConfigurationData

    @Column({ name: 'name' })
    public name: string

    @Column({ name: 'user_id' })
    public authorId: string

    @Column({ name: 'application_id' })
    public applicationId: string

    @Column({ name: 'created_at'})
    public createdAt: Date

    constructor(
        type: CdTypeEnum,
        configurationData: ICdConfigurationData,
        name: string,
        authorId: string,
        applicationId: string
    ) {
        super()
        this.id = uuidv4()
        this.type = type
        this.configurationData = configurationData
        this.name = name
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
