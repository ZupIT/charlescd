import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConsoleLoggerService } from '../../core/logs/console'
import { EventsWatcher } from './kubernetes-events-watcher'

@Injectable()
export class EventsOperatorService implements OnApplicationBootstrap {

  constructor(private eventsWatcher: EventsWatcher, 
    private consoleLoggerService: ConsoleLoggerService) {}
  
  public async onApplicationBootstrap(): Promise<void> {
    try {
      return await this.eventsWatcher.start()
    } catch(error) {
      this.consoleLoggerService.error(error)
    }
  }
}