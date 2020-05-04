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
    const trace = stackTrace.get()[1]
     return winston.createLogger({
      format: winston.format.combine(
      winston.format.timestamp(),
      this.jsonFormat(trace),
    ),
      transports: [
        new winston.transports.Console()
      ]
    })
  }

  private static jsonFormat(trace: any) {
    return winston.format.printf(({timestamp, level, message, ...data}) => {
      console.log(JSON.stringify(data))
      return JSON.stringify({
        requestId: rTracer.id(),
        timestamp: timestamp,
        level: level,
        message: message,
        data,
         ...this.TraceLogger(trace)
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
   private static TraceLogger(trace: StackFrame) {
    return {
      fileName: trace.getFileName(),
      functionName: trace.getFunctionName(),
    }
  }
}
