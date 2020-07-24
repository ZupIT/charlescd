import { DeploymentStatusEnum } from '../../v1/api/deployments/enums'
import { Component } from './component.interface'

export interface Deployment {
    id: string

    authorId: string

    callbackUrl: string

    status: DeploymentStatusEnum

    createdAt: Date

    finishedAt: Date

    cdConfigurationId: string

    circleId: string | null

    components: Component[]
}