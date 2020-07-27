import { CdTypeEnum } from '../../v1/api/configurations/enums'
import { ICdConfigurationData } from '../../v1/api/configurations/interfaces'
import { Deployment } from './'

export interface CdConfiguration {
    id: string

    type: CdTypeEnum,

    configurationData: ICdConfigurationData,

    name: string

    authorId: string

    workspaceId: string

    createdAt: Date

    deployments: Deployment[] | null
}