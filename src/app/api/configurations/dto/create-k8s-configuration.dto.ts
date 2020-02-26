export class CreateK8sConfigurationDto {

    public readonly name: string

    public readonly account: string

    public readonly namespace: string

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
}
