import {
    CdConfigurationDataEntity,
    CdConfigurationEntity
} from '../entity'
import { Allow } from 'class-validator'

export class CreateCdConfigurationDto {

    @Allow()
    public readonly name: string

    @Allow()
    public readonly account: string

    @Allow()
    public readonly namespace: string

    @Allow()
    public readonly authorId: string

    constructor(
        name: string,
        account: string,
        namespace: string,
        authorId: string
    ) {
        this.name = name
        this.account = account
        this.namespace = namespace
        this.authorId = authorId
    }

    public toEntity(applicationId: string): CdConfigurationEntity {
        return new CdConfigurationEntity(
            this.name,
            this.createCdConfigurationData(),
            this.authorId,
            applicationId
        )
    }

    private createCdConfigurationData(): CdConfigurationDataEntity {
        return new CdConfigurationDataEntity(
            this.account,
            this.namespace
        )
    }
}
