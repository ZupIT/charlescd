import { HttpService, Inject, Injectable } from '@nestjs/common'
import { ConsoleLoggerService } from '../../logs/console'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'
import { AxiosResponse } from 'axios'
import { IoCTokensConstants } from '../../constants/ioc'
import {Observable} from 'rxjs';

@Injectable()
export class MooveService {

    constructor(
      private readonly httpService: HttpService,
      private readonly consoleLoggerService: ConsoleLoggerService,
      @Inject(IoCTokensConstants.ENV_CONFIGURATION)
      private readonly envConfiguration: IEnvConfiguration
    ) {}

    public  notifyDeploymentStatus(
      deploymentId: string,
      status: string,
      callbackUrl: string,
      circleId: string
    ): Observable<AxiosResponse> {

      try {
        this.consoleLoggerService.log('START:NOTIFY_DEPLOYMENT_STATUS', { deploymentId, status, callbackUrl })
        return this.httpService.post(
          callbackUrl,
          { deploymentStatus: status },
          { ...(circleId && { headers: { 'x-circle-id': circleId } }) }
        )
        this.consoleLoggerService.log('FINISH:NOTIFY_DEPLOYMENT_STATUS')
      } catch (error) {
        this.consoleLoggerService.error('ERROR:NOTIFY_DEPLOYMENT_STATUS', error)
        throw error
      }
    }
}
