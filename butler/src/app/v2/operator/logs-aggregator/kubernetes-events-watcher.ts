import * as k8s from '@kubernetes/client-node'
import { Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { K8sClient } from '../../core/integrations/k8s/client'
import { ConsoleLoggerService } from '../../core/logs/console'
import { EventsLogsAggregator } from './kubernetes-events-aggregator'

@Injectable()
export class EventsWatcher {

  private lastConnectionLostTimestamp?: Date
  private connected = false

  constructor(private k8sClient: K8sClient,
    private eventsLogsAggregator: EventsLogsAggregator,
    private consoleLoggerService: ConsoleLoggerService
  ) { }

  public async start(): Promise<void> {
    return this.k8sClient.watchEvents(
      this.processEvent.bind(this),
      this.onFinishOrError.bind(this))
      .then(this.verifyConnectivity.bind(this))
      .catch(this.onError.bind(this))
  }

  private async processEvent(phase: string, coreEvent: k8s.CoreV1Event) {
    this.eventsLogsAggregator.processEvent(coreEvent, this.lastConnectionLostTimestamp)
  }

  private verifyConnectivity(req: k8s.RequestResult) {
    req.on('response', () => {
      this.connected = true
      this.consoleLoggerService.log('Connected!! Watching events...')
    })
  }

  private onError(error: Error) {
    // This is a startup error, should be verified evertime butler goes hair!
    this.consoleLoggerService.error('Error while trying to start streaming events', error)
  }

  // Called by any connection error or simple a close connection event
  private async onFinishOrError(error?: Error) {
    if (error) {
      this.consoleLoggerService.error('Connection Error', error)
    }

    this.consoleLoggerService.log('Connected lost! Reestablishing...')

    // Had an established connection
    if (this.connected) {
      this.lastConnectionLostTimestamp = moment.utc().toDate()
      this.connected = false
    }

    this.retryWatchEvents()
  }

  private async retryWatchEvents() {
    const restartIn = 5 // five seconds?
    this.consoleLoggerService.log(`Restarting watching events in ${restartIn} seconds...`)
    setTimeout(async() => this.start(), restartIn * 1000)
  }
}