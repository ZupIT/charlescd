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
  ExceptionFilter, HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { plainToClass } from 'class-transformer'
import { ErrorResponse } from '../utils/exception.utils'
import { JsonAPIError } from '../../api/deployments/validations/create-deployment-validator'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: BadRequestException, host: ArgumentsHost): void {
    const responseError = exception.getResponse() as string | Record<string, unknown>
    const responseObject = this.convertToObject(responseError)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    response
      .status(exception.getStatus())
      .json( this.getJsonResponse(responseObject, exception))
  }

  private convertToObject(response: string | Record<string, unknown>): ErrorResponse | undefined {
    if( typeof(response) === 'string') {
      return undefined
    }
    return plainToClass(ErrorResponse, response)
  }

  private extractDetailedResponse(responseObject: ErrorResponse) : JsonAPIError {
    return  {
      errors: responseObject.errors.map(error => {
        return {
          title: error.title,
          detail: error.detail,
          meta: {
            component: 'butler',
            timestamp: Date.now()
          },
          status: error.status,
          source: {
            pointer: error.source
          }
        }
      }
      )
    }
  }

  private getJsonResponse(responseObject: ErrorResponse | undefined, exception: HttpException) {
    if(responseObject != null && responseObject.errors != null) {
      return this.extractDetailedResponse(responseObject)
    }
    return exception.getResponse()
  }
}
