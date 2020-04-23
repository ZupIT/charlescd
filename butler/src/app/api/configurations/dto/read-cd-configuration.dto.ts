export class ReadCdConfigurationDto {

    public readonly id: string

    public readonly name: string

    public readonly authorId: string

    public readonly workspaceId: string

    public readonly createdAt: Date

    constructor(
        id: string,
        name: string,
        authorId: string,
        workspaceId: string,
        createdAt: Date
    ) {
        this.id = id
        this.name = name
        this.authorId = authorId
        this.workspaceId = workspaceId
        this.createdAt = createdAt
    }
}
