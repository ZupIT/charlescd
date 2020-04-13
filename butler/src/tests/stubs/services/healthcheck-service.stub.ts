import { IReadHealthcheckStatus } from '../../../app/api/healthcheck/interfaces'

export class HealthcheckServiceStub {

    public getHealthcheckStatus(): Promise<IReadHealthcheckStatus> {
        return Promise.resolve({} as IReadHealthcheckStatus)
    }
}
