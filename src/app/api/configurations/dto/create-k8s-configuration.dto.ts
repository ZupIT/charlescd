import {
    K8sConfigurationDataEntity,
    K8sConfigurationEntity
} from '../entity'

export class CreateK8sConfigurationDto {

    public readonly name: string

    public readonly account: string

    public readonly namespace: string

    public readonly authorId: string

    public readonly applicationId: string

    constructor(
        name: string,
        account: string,
        namespace: string,
        authorId: string,
        applicationId: string
    ) {
        this.name = name
        this.account = account
        this.namespace = namespace
        this.authorId = authorId
        this.applicationId = applicationId
    }

    public toEntity(): K8sConfigurationEntity {
        return new K8sConfigurationEntity(
            this.name,
            this.createK8sConfigurationData(),
            this.authorId,
            this.applicationId
        )
    }

    private createK8sConfigurationData(): K8sConfigurationDataEntity {
        return new K8sConfigurationDataEntity(
            this.account,
            this.namespace
        )
    }
}
