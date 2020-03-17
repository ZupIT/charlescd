import { CdConfigurationEntity } from '../entity'
import { Allow } from 'class-validator'
import { CdTypeEnum } from '../enums'
import { ICdConfigurationData } from '../interfaces'

export class CreateCdConfigurationDto {

    @Allow()
    public readonly type: CdTypeEnum

    @Allow()
    public readonly configurationData: ICdConfigurationData

    @Allow()
    public readonly name: string

    @Allow()
    public readonly authorId: string

    constructor(
        type: CdTypeEnum,
        configurationData: ICdConfigurationData,
        name: string,
        authorId: string
    ) {
        this.type = type
        this.configurationData = configurationData
        this.name = name
        this.authorId = authorId
    }

    public toEntity(applicationId: string): CdConfigurationEntity {
        return new CdConfigurationEntity(
            this.type,
            this.configurationData,
            this.name,
            this.authorId,
            applicationId
        )
    }
}
