import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import { TraceLogger } from './trace-logger'
import * as stackTrace from 'stack-trace'
import * as rTracer from 'cls-rtracer'

@Injectable()
export class ConsoleLoggerService {

  private logger: winston.Logger

  constructor() {
    this.logger = ConsoleLoggerService.createLogger()
  }

  private static createLogger(): winston.Logger {
    const trace = stackTrace.get()[1]
    const rid = rTracer.id()
    return winston.createLogger({
      format: winston.format.combine(
      winston.format.timestamp(),
      this.jsonFormat(trace, rid),
    ),
      transports: [
        new winston.transports.Console(),
        new (winston.transports.File)({
          filename: 'log.log',

        }),
      ]
    })
  }

  private static jsonFormat(trace: any, rid: any) {
    return winston.format.printf(({timestamp, level, message, ...meta}) => {
      return JSON.stringify({
        requestId: rTracer.id(),
        timestamp: timestamp,
        level: level,
        message: message,
        meta,
         ...TraceLogger(trace)
      })
    })
  }

  public log(
    message: string,
    messageObject?: any
  ): void {

    this.logger.log('info', message, messageObject)
  }

  public error(
    error: string,
    errorObject?: Error
  ): void {

    this.logger.log('error', error, { error: errorObject })
  }
}
