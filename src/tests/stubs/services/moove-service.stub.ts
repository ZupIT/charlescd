import { IK8sConfiguration } from '../../../app/core/integrations/configuration/interfaces'

export class MooveServiceStub {

    public async notifyDeploymentStatus(): Promise<void> {
        return Promise.resolve()
    }

    public async getK8sConfiguration(): Promise<IK8sConfiguration> {
        return Promise.resolve({} as IK8sConfiguration)
    }
}
