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
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    if(!this.alreadyDetailedError(exception.getResponse())) {
      response
        .status(exception.getStatus())
        .json({
          errors: [{
            title: this.getExceptionMessage(exception.getResponse()),
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
  private getExceptionMessage(response: string | Record<string, any>) {
    return typeof response === 'string' ? response  : this.convertToClass(response)
  }

  private convertToClass(response: Record<string, any>): Record<string, any> | string {
    return plainToClass(ErrorResponse, response).message
  }
  private alreadyDetailedError(response: string | Record<string, any>): boolean {
    return  typeof response !== 'string' &&  Object.entries(response).some(
      ([key, value]) => key === 'errors')
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

