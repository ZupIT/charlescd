import { NotificationStatusEnum } from '../enums'

export class FinishDeploymentDto {

  public readonly status: string

  public isSuccessful(): boolean {
    return this.status === NotificationStatusEnum.SUCCEEDED
  }
}
