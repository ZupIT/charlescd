import { IReadHealthcheckStatus } from '../../../app/api/healthcheck/interfaces'
import { HealthcheckStatusEnum } from '../../../app/api/healthcheck/enums'

export class HealthcheckServiceStub {

    public getHealthcheckStatus(): Promise<IReadHealthcheckStatus> {
        return Promise.resolve({ status: HealthcheckStatusEnum.OK })
    }
}
