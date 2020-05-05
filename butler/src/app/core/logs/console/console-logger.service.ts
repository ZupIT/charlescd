import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import * as rTracer from 'cls-rtracer'
import * as stackTrace from 'stack-trace'
import { StackFrame } from 'stack-trace'

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
    return winston.format.printf(({timestamp, level, message, ...data}) => {
      return JSON.stringify({
        requestId: rTracer.id(),
        timestamp: timestamp,
        level: level,
        message: message,
        ...data,
      })
    })
  }

  public log(
    message: string,
    messageObject?: any
  ): void {

    this.logger.log('info', message, this.getDataTrace(messageObject))
  }

  public error(
    error: string,
    errorObject?: Error
  ): void {
    this.logger.log('error', error, { error: errorObject })
  }

  public getDataTrace(data: any) {
    return { data, functionName: stackTrace.get()[2].getFunctionName(), fileName: stackTrace.get()[2].getFileName() }
  }
}
