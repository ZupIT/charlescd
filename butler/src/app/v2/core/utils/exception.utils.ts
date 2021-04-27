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

import { HttpException } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

export class ExceptionBuilder  {
      public title: string
      public detail?: string
      public source?: string
      public status: number
  
      constructor(title: string, status: HttpStatus) {
        this.title = title
        this.status = status ? status.valueOf() : HttpStatus.INTERNAL_SERVER_ERROR.valueOf()
      }


      public withDetail(detail: string): ExceptionBuilder{
        this.detail = detail
        return this
      }

      public withSource(source: string): ExceptionBuilder{
        this.source = source
        return this
      }
    
      public build(): HttpException {
        const errorDetails = new ErrorDetails(this.title, this.status, this.source, this.detail)
        return new HttpException(new ErrorResponse([errorDetails]), this.status)
      }

      public static buildFromArray(errors: ExceptionBuilder[], status: HttpStatus): HttpException {
        return new HttpException(new ErrorResponse(errors), status)
      }
}

export class ErrorDetails {
  public title: string
  public detail?: string
  public source?: string
  public status: number

  constructor(title: string, status: number, source: string | undefined, details: string | undefined) {
    this.title = title
    this.status = status
    this.source = source
    this.detail = details
  }
}
export class ErrorResponse {
  public errors: ErrorDetails[];
  constructor(errors: ErrorDetails[]){
    this.errors = errors
  }
}