export class ReadModuleUndeploymentDto {

    public readonly id: string

    public readonly moduleUndeployment: string

    public readonly componentsUndeployments: ReadComponentUndeploymentDto[]

    public readonly status: string

    public readonly createdAt: Date

    constructor(
        id: string,
        moduleUndeployment: string,
        componentsUndeployments: ReadComponentUndeploymentDto[],
        status: string,
        createdAt: Date
    ) {
        this.id = id
        this.moduleUndeployment = moduleUndeployment
        this.componentsUndeployments = componentsUndeployments
        this.status = status
        this.createdAt = createdAt
    }
}
