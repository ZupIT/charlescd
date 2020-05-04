import { NotificationStatusEnum } from '../enums'
import { Allow } from 'class-validator'

export class FinishDeploymentDto {

  @Allow()
  public readonly status: string

  constructor(
      status: string
  ) {
    this.status = status
  }

  public isSuccessful(): boolean {
    return this.status === NotificationStatusEnum.SUCCEEDED
  }
}
