/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as k8s from '@kubernetes/client-node'
import { Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { K8sClient } from '../../core/integrations/k8s/client'
import { ConsoleLoggerService } from '../../core/logs/console'
import { EventsLogsAggregator } from './kubernetes-events-aggregator'

@Injectable()
export class EventsWatcher {

  private static readonly RESTART_DELAY_IN_SECONDS = 5

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
    try {
      await this.eventsLogsAggregator.aggregate(coreEvent, this.lastConnectionLostTimestamp)
    } catch (error) {
      this.consoleLoggerService.error('Error processing event', error)
    }
  }

  private verifyConnectivity(req: k8s.RequestResult) {
    req.on('response', () => {
      this.connected = true
      this.consoleLoggerService.log('Connected!! Watching events...')
    })

    req.on('end', this.onFinishOrError.bind(this))
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

    this.restart()
  }

  private async restart() {
    this.consoleLoggerService.log(`Restarting watching events in ${EventsWatcher.RESTART_DELAY_IN_SECONDS} seconds...`)
    setTimeout(async () => this.start(), EventsWatcher.RESTART_DELAY_IN_SECONDS * 1000)
  }
}
