import { Injectable } from '@nestjs/common'
import * as winston from 'winston'

@Injectable()
export class ConsoleLoggerService {

  private logger: winston.Logger

  constructor() {
    this.logger = ConsoleLoggerService.createLogger()
  }

  private static createLogger(): winston.Logger {
    return winston.createLogger({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple()
      ),
      transports: [
        new winston.transports.Console()
      ]
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
