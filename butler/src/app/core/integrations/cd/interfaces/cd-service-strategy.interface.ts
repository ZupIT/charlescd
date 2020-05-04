import { IConnectorConfiguration } from './connector-configuration.interface'

export interface ICdServiceStrategy {

    createDeployment(configuration: IConnectorConfiguration): Promise<void>
}
