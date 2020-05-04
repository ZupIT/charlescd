export class ReadComponentUndeploymentDto {

    public readonly id: string

    public readonly componentDeployment: string

    public readonly status: string

    public readonly createdAt: Date

    constructor(
        id: string,
        componentDeployment: string,
        status: string,
        createdAt: Date
    ) {
        this.id = id
        this.componentDeployment = componentDeployment
        this.status = status
        this.createdAt = createdAt
    }
}
