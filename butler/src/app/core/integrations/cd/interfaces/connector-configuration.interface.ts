import { ICdConfigurationData } from '../../../../api/configurations/interfaces'
import { IPipelineOptions } from '../../../../api/components/interfaces'

export interface IConnectorConfiguration {

    pipelineCirclesOptions: IPipelineOptions

    cdConfiguration: ICdConfigurationData

    componentId: string

    applicationName: string

    componentName: string

    helmRepository: string

    callbackCircleId: string

    pipelineCallbackUrl: string
}
