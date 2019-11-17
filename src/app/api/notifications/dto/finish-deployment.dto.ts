import { NotificationStatusEnum } from '../enums'

export class FinishDeploymentDto {

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
