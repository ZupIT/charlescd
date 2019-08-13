import {HttpService, Injectable} from '@nestjs/common'
import { ConsoleLoggerService } from '../../logs/console'

@Injectable()
export class MooveService {

    constructor(
      private readonly httpService: HttpService,
      private readonly consoleLoggerService: ConsoleLoggerService) {}

    public async notifyDeploymentStatus(deploymentId: string, status: string, callbackUrl: string): Promise<void> {
      try {
        this.consoleLoggerService.log('START:NOTIFY_DEPLOYMENT_STATUS', { deploymentId, status, callbackUrl })
        await this.httpService.post(
          callbackUrl,
          { deploymentStatus: status },
        ).toPromise()
        this.consoleLoggerService.log('FINISH:NOTIFY_DEPLOYMENT_STATUS')
      } catch (error) {
        this.consoleLoggerService.error('ERROR:NOTIFY_DEPLOYMENT_STATUS', error)
        throw error
      }
    }
}
