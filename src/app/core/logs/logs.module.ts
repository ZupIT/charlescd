import { Module } from '@nestjs/common'
import { ConsoleLoggerService } from './console'

@Module({
  providers: [
    ConsoleLoggerService
  ],
  exports: [
    ConsoleLoggerService
  ]
})
export class LogsModule {}
