/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpService, Inject, Injectable } from '@nestjs/common'
import { Observable, of, throwError } from 'rxjs'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { AppConstants } from '../../constants'
import { IoCTokensConstants } from '../../constants/ioc'
import { ConsoleLoggerService } from '../../logs/console'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'
import { AxiosResponse } from 'axios'

@Injectable()
export class MooveService {

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  public async notifyDeploymentStatus(
    deploymentId: string,
    status: string,
    callbackUrl: string,
    circleId: string
  ): Promise<void> {

    try {
      this.consoleLoggerService.log('START:NOTIFY_DEPLOYMENT_STATUS', { deploymentId, status, callbackUrl })
      await this.httpService.post(
        callbackUrl,
        { deploymentStatus: status },
        { ...(circleId && { headers: { 'x-circle-id': circleId } }) }
      ).pipe(
        map(response => response),
        retryWhen(error => this.getNotificationRetryCondition(error))
      ).toPromise()
      this.consoleLoggerService.log('FINISH:NOTIFY_DEPLOYMENT_STATUS', { deploymentId, status, callbackUrl })
    } catch (error) {
      this.consoleLoggerService.error('ERROR:NOTIFY_DEPLOYMENT_STATUS', error)
      throw error
    }
  }

  public async notifyDeploymentStatusV2(
    deploymentId: string,
    status: string,
    callbackUrl: string,
    circleId: string | null
  ): Promise<AxiosResponse<unknown>> { // TODO maybe create a response interface

    try {
      this.consoleLoggerService.log('START:NOTIFY_DEPLOYMENT_STATUS', { deploymentId, status, callbackUrl })
      const response = await this.httpService.post(
        callbackUrl,
        { deploymentStatus: status },
        { ...(circleId && { headers: { 'x-circle-id': circleId } }) }
      ).pipe(
        map(response => response),
        retryWhen(error => this.getNotificationRetryCondition(error))
      ).toPromise()
      this.consoleLoggerService.log('FINISH:NOTIFY_DEPLOYMENT_STATUS', { deploymentId, status, callbackUrl })
      return response
    } catch (error) {
      this.consoleLoggerService.error('ERROR:NOTIFY_DEPLOYMENT_STATUS', error)
      return error
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getNotificationRetryCondition(deployError: Observable<any>) {

    return deployError.pipe(
      concatMap((error, attempts) => {
        return attempts >= AppConstants.MOOVE_NOTIFICATION_MAXIMUM_RETRY_ATTEMPTS ?
          throwError('Reached maximum attemps.') :
          this.getNotificationRetryPipe(error, attempts)
      })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getNotificationRetryPipe(error: Observable<any>, attempts: number) {

    return of(error).pipe(
      tap(() => this.consoleLoggerService.log(`Deploy attempt #${attempts + 1}. Retrying deployment: ${error}`)),
      delay(AppConstants.MOOVE_NOTIFICATION_MILLISECONDS_RETRY_DELAY)
    )
  }
}
