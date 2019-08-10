import { Injectable } from '@nestjs/common'
import { IReadHealthcheckStatus } from '../interfaces'
import { HealthcheckStatusEnum } from '../enums'

@Injectable()
export class HealthcheckService {

  public getHealthcheckStatus(): IReadHealthcheckStatus {
    return {
      status: HealthcheckStatusEnum.OK
    }
  }
}
