import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventsLogsAggregator } from './kubernetes-events-aggregator'

@Injectable()
export class EventsOperatorService implements OnApplicationBootstrap {

  constructor(private eventsLogsAggregator: EventsLogsAggregator) {}
  
  public async onApplicationBootstrap(): Promise<void> {
    return this.eventsLogsAggregator.watchEvents()
  }
}