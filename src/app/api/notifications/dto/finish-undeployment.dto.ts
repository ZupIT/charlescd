import { NotificationStatusEnum } from '../enums'

export class FinishUndeploymentDto {

    public readonly status: string

    public isSuccessful(): boolean {
        return this.status === NotificationStatusEnum.SUCCEEDED
    }
}
