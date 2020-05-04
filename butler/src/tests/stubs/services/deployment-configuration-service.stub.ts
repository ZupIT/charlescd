import { IDeploymentConfiguration } from '../../../app/core/integrations/configuration/interfaces'

export class DeploymentConfigurationServiceStub {

    public async getConfiguration(): Promise<IDeploymentConfiguration> {
        return Promise.resolve({} as IDeploymentConfiguration)
    }
}
