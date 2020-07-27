import { DeploymentStatusEnum } from '../../v1/api/deployments/enums'
import { Component } from './component.interface'
import { CdConfiguration } from './'

export interface Deployment {
    id: string

    authorId: string

    callbackUrl: string

    status: DeploymentStatusEnum

    createdAt: Date

    finishedAt: Date | null

    cdConfiguration: CdConfiguration

    circleId: string | null

    components?: Component[]
}