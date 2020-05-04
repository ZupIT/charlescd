import { HttpService, Inject, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Observable, of, throwError } from 'rxjs'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { AppConstants } from '../../constants'
import { IoCTokensConstants } from '../../constants/ioc'
import { ConsoleLoggerService } from '../../logs/console'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'

@Injectable()
export class MooveService {

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  public notifyDeploymentStatus(
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
      ).pipe(
        map(response => response),
        retryWhen(error => this.getNotificationRetryCondition(error))
      )
    } catch (error) {
      this.consoleLoggerService.error('ERROR:NOTIFY_DEPLOYMENT_STATUS', error)
      throw error
    }
  }
  private getNotificationRetryCondition(deployError: Observable<any>) {

    return deployError.pipe(
      concatMap((error, attempts) => {
        return attempts >= AppConstants.MOOVE_NOTIFICATION_MAXIMUM_RETRY_ATTEMPTS ?
          throwError('Reached maximum attemps.') :
          this.getNotificationRetryPipe(error, attempts)
      })
    )
  }

  private getNotificationRetryPipe(error: Observable<any>, attempts: number) {

    return of(error).pipe(
      tap(() => this.consoleLoggerService.log(`Deploy attempt #${attempts + 1}. Retrying deployment: ${error}`)),
      delay(AppConstants.MOOVE_NOTIFICATION_MILLISECONDS_RETRY_DELAY)
    )
  }
}
