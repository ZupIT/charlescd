import { HttpService, Injectable } from '@nestjs/common'
import { ConsoleLoggerService } from '../../logs/console'
import { AppConstants } from '../../constants'

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

    public async getK8sConfiguration(k8sConfigurationId: string) {
      try {
        return await this.httpService.get(
          `${AppConstants.MOOVE_URL}/credentials/registry/${k8sConfigurationId}`,
          { headers: { 'x-organization': 'zup' } }
        ).toPromise()
      } catch (error) {
        throw error
      }
    }
}
