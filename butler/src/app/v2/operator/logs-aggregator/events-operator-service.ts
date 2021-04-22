import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConsoleLoggerService } from '../../core/logs/console'
import { EventsLogsAggregator } from './kubernetes-events-aggregator'

@Injectable()
export class EventsOperatorService implements OnApplicationBootstrap {

  constructor(private eventsLogsAggregator: EventsLogsAggregator, 
    private consoleLoggerService: ConsoleLoggerService) {}
  
  public async onApplicationBootstrap(): Promise<void> {
    try {
      return await this.eventsLogsAggregator.watchEvents()
    } catch(error) {
      this.consoleLoggerService.error(error)
    }
  }
}