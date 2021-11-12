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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Injectable } from '@nestjs/common'
import * as bunyan from 'bunyan'
import * as stackTrace from 'stack-trace'
import * as bunyanDebugStream from 'bunyan-debug-stream'
@Injectable()
export class ConsoleLoggerService {

  private logger: bunyan

  constructor() {
    this.logger = ConsoleLoggerService.createLogger()
  }

  private static createLogger(): bunyan {

    return bunyan.createLogger({
      name: 'butler',
      streams: [{
        level:  'info',
        type:   'raw',
        stream: bunyanDebugStream({
          basepath: process.cwd(), // this should be the root folder of your project.
          forceColor: true
        })
      }],
      serializers: bunyanDebugStream.serializers
    })
  }

  public log(
    message: string,
    messageObject?: any
  ): void {
    if (process.env.NODE_ENV !== 'test') {
      this.logger.info(this.getDataTrace(messageObject), message)
    }
  }

  public error(
    error: string,
    errorObject?: any
  ): void {
    if (process.env.NODE_ENV !== 'test') {
      this.logger.error({ error: JSON.stringify(errorObject, errorObject != null ? Object.getOwnPropertyNames(errorObject) : null) }, error)
    }
  }

  public getDataTrace(data?: any) {
    return { data, functionName: stackTrace.get()[2].getFunctionName(), fileName: stackTrace.get()[2].getFileName() }
  }

}
