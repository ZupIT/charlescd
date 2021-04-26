import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Response } from 'express'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    console.log(exception)
    console.log(response)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception
    if (!response.get('title') && !response.get('details')){
      response
        .status(status)
        .json({
          errors: [{
            title: message,
            meta: {
              component: 'butler',
              timestamp: Date.now()
            },
            status: status
          }]
        }
        )
    }
  }

}