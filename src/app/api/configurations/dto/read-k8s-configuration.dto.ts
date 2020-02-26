export class ReadK8sConfigurationDto {

    public readonly id: string

    public readonly name: string

    public readonly authorId: string

    public readonly createdAt: Date

    constructor(
        id: string,
        name: string,
        authorId: string,
        createdAt: Date
    ) {
        this.id = id
        this.name = name
        this.authorId = authorId
        this.createdAt = createdAt
    }
}
