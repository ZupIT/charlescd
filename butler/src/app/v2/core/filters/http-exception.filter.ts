import {
  ArgumentsHost, BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common'
import { Response } from 'express'
import { plainToClass } from 'class-transformer'

@Catch(BadRequestException)
/* eslint-disable @typescript-eslint/no-explicit-any */
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

  private convertToClass(response: Record<string, any>): Record<string, unknown> | string {
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

