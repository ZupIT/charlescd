import { HttpService, Injectable } from '@nestjs/common'
import { ConsoleLoggerService } from '../../logs/console'
import { AppConstants } from '../../constants'
import { map } from 'rxjs/operators'

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
        this.consoleLoggerService.log(
          'START:GET_K8S_CONFIG',
          { k8sConfigurationId, url: `${AppConstants.MOOVE_URL}/credentials/k8s/${k8sConfigurationId}` }
        )

        const k8sConfiguration =
          await this.httpService.get(
          `${AppConstants.MOOVE_URL}/credentials/k8s/${k8sConfigurationId}`,
          { headers: { 'x-organization': 'zup' } }
        ).pipe(
          map(res => res.data)
        ).toPromise()

        this.consoleLoggerService.log('FINISH:NOTIFY_DEPLOYMENT_STATUS')
        return k8sConfiguration.value
      } catch (error) {
        this.consoleLoggerService.error('ERROR:GET_K8S_CONFIG', error)
        throw error
      }
    }
}
