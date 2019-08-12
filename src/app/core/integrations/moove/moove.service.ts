import {HttpService, Injectable} from '@nestjs/common'

@Injectable()
export class MooveService {

    constructor(private readonly httpService: HttpService) {
    }

    public async notifyDeploymentStatus(deploymentId: string, status: string, callbackUrl: string): Promise<void> {
        await this.httpService.post(
            callbackUrl,
            {deploymentStatus: status},
        ).toPromise()
    }

}
