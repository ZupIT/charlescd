import {HttpService, Injectable} from '@nestjs/common'
import {AppConstants} from '../../constants'

@Injectable()
export class MooveService {

    constructor(private readonly httpService: HttpService) {
    }

    public async notifyDeploymentStatus(deploymentId: string, status: string): Promise<void> {
        await this.httpService.post(
            AppConstants.MOOVE_URL,
            {deploymentStatus: status},
        ).toPromise()
    }

}
