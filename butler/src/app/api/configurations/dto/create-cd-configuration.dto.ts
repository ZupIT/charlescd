import { CdConfigurationEntity } from '../entity'
import {
    IsDefined,
    IsNotEmpty
} from 'class-validator'
import { CdTypeEnum } from '../enums'
import { ICdConfigurationData } from '../interfaces'

export class CreateCdConfigurationDto {

    @IsNotEmpty()
    public readonly type: CdTypeEnum

    @IsDefined()
    public readonly configurationData: ICdConfigurationData

    @IsNotEmpty()
    public readonly name: string

    @IsNotEmpty()
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

    public toEntity(workspaceId: string): CdConfigurationEntity {
        return new CdConfigurationEntity(
            this.type,
            this.configurationData,
            this.name,
            this.authorId,
            workspaceId
        )
    }
}
