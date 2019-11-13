import { ReadDeploymentDto } from '../../../app/api/deployments/dto'

export class DeploymentsServiceStub {

    public async getDeployments(): Promise<ReadDeploymentDto[]> {
        return Promise.resolve([])
    }
}
