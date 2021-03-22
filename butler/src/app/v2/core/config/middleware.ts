import { Injectable, NestMiddleware, Logger } from '@nestjs/common'

import { Request, Response, NextFunction } from 'express'
import { inspect } from 'util'

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {


  public use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request
    const userAgent = request.get('user-agent') || ''
    response.on('close', () => {
      const logger = new Logger('HTTP')
      const { statusCode } = response
      const contentLength = response.get('content-length')
      logger.log(
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${inspect(request.body)}`
      )
    })

    next()
  }
}