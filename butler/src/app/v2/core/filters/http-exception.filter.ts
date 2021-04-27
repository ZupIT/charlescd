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

import {
  ArgumentsHost, BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common'
import { Response } from 'express'
import { plainToClass } from 'class-transformer'

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: BadRequestException, host: ArgumentsHost): void {
    const errorResponse = exception.getResponse()  as string | Record<string, unknown>
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    if(!this.alreadyDetailedError(errorResponse)) {
      response
        .status(exception.getStatus())
        .json({
          errors: [{
            title: this.getExceptionMessage(errorResponse),
            meta: {
              component: 'butler',
              timestamp: Date.now()
            },
            status: exception.getStatus()
          }]
        })
    } else {
      response
        .status(exception.getStatus())
        .json(exception.getResponse())
    }
  }
  private getExceptionMessage(response: string | Record<string, unknown>) {
    return typeof response === 'string' ? response  : this.convertToClass(response)
  }

  private convertToClass(response: Record<string, unknown>): Record<string, unknown> | string {
    return plainToClass(ErrorResponse, response).message
  }
  private alreadyDetailedError(response: string | Record<string, unknown>): boolean {
    return  typeof response !== 'string' &&  Object.keys(response).some(
      (key) => key === 'errors')
  }

}

export class ErrorResponse {
    public message: string;
    public statusCode: string;
    
    constructor(
      message: string,
      statusCode: string
    ) {
      this.message = message
      this.statusCode = statusCode
    }
}

