import {
    K8sConfigurationDataEntity,
    K8sConfigurationEntity
} from '../entity'
import { Allow } from 'class-validator'

export class CreateK8sConfigurationDto {

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

    public toEntity(applicationId: string): K8sConfigurationEntity {
        return new K8sConfigurationEntity(
            this.name,
            this.createK8sConfigurationData(),
            this.authorId,
            applicationId
        )
    }

    private createK8sConfigurationData(): K8sConfigurationDataEntity {
        return new K8sConfigurationDataEntity(
            this.account,
            this.namespace
        )
    }
}
