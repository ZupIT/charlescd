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
import * as winston from 'winston'
import * as rTracer from 'cls-rtracer'
import * as stackTrace from 'stack-trace'

@Injectable()
export class ConsoleLoggerService {

  private logger: winston.Logger

  constructor() {
    this.logger = ConsoleLoggerService.createLogger()
  }

  private static createLogger(): winston.Logger {

    return winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        this.jsonFormat(),
      ),
      transports: [
        new winston.transports.Console()
      ]
    })
  }

  private static jsonFormat() {
    return winston.format.printf(({ timestamp, level, message, ...data }) => {

      return JSON.stringify({
        requestId: rTracer.id(),
        timestamp,
        level,
        message,
        ...data,
      })
    })
  }

  public log(
    message: string,
    messageObject?: any
  ): void {
    if (process.env.NODE_ENV !== 'test') {
      this.logger.log('info', message, this.getDataTrace(messageObject))
    }
  }

  public error(
    error: string,
    errorObject?: any
  ): void {
    if (process.env.NODE_ENV !== 'test') {
      this.logger.log('error', error, { error: JSON.stringify(errorObject, errorObject != null ? Object.getOwnPropertyNames(errorObject) : null) })
    }
  }

  public getDataTrace(data?: any) {
    return { data, functionName: stackTrace.get()[2].getFunctionName(), fileName: stackTrace.get()[2].getFileName() }
  }

}
