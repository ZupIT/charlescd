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
import * as http from 'http'
import * as moment from 'moment'
import { LogEntity } from '../../api/deployments/entity/logs.entity'
import { ConsoleLoggerService } from '../../core/logs/console'
import { Log } from '../../api/deployments/interfaces/log.interface'
import { K8sClient } from '../../core/integrations/k8s/client'
import { LogRepository } from '../../api/deployments/repository/log.repository'

@Injectable()
export class EventsLogsAggregator {

  private readonly resourceCache: Record<string, Promise<{
    body: k8s.KubernetesObject
    response: http.IncomingMessage
  }>> // TODO: configure a LRU cache here

  constructor(private k8sClient: K8sClient,
    private logsRepository: LogRepository,
    private consoleLoggerService: ConsoleLoggerService) {
    this.resourceCache = {}
  }

  public async aggregate(coreEvent: k8s.CoreV1Event, since?: Date): Promise<void> {
    try {
      const involvedObject = coreEvent.involvedObject

      if (!involvedObject.namespace
        || !involvedObject.kind
        || !involvedObject.apiVersion
        || !involvedObject.name) {
        this.consoleLoggerService.log('Unexpected behavior! "event.involvedObject" does not have mandatory data! Discarding event', involvedObject)
        return
      }

      const response = await this.resourceFor(
        involvedObject.namespace,
        involvedObject.kind,
        involvedObject.apiVersion,
        involvedObject.name
      )
      const event = new Event(coreEvent)
      if (this.hasAnyLabel(response.body, ['deploymentId'])
        && this.isAfter(event, since)) {

        const deploymentId = response.body.metadata?.labels?.['deploymentId']

        if (!deploymentId) {
          this.consoleLoggerService.log('Unexpected behavior! "deploymentId" is mandatory! Discarding event')
          return
        }

        const log = {
          type: event.type,
          title: event.title,
          timestamp: moment(event.timestamp).format(),
          details: event.details
        }

        this.consoleLoggerService.log(`Saving log for deployment "${deploymentId}"`)
        this.saveLogs(deploymentId, log)
      }
    } catch (error) {
      this.consoleLoggerService.error('Error processing event', error)
    }
  }

  private async saveLogs(deploymentId: string, log: Log): Promise<LogEntity> {
    const logEntity = new LogEntity(deploymentId, [log])
    return this.logsRepository.save(logEntity)
  }

  private isAfter(event: Event, since?: Date): boolean {
    return !since || event.isAfter(since)
  }

  private hasAnyLabel(resource: k8s.KubernetesObject, labels: string[]): boolean {
    for (const label of labels) {
      if (resource.metadata?.labels?.[label]) {
        return true
      }
    }
    return false
  }

  private async resourceFor(namespace: string, kind: string, apiVersion: string, name: string):
    Promise<{
      body: k8s.KubernetesObject,
      response: http.IncomingMessage
    }> {
    const cacheKey = this.createCacheKey(namespace, kind, name)
    if (this.resourceCache[cacheKey]) {
      return this.resourceCache[cacheKey]
    }

    const spec = {
      kind: kind,
      apiVersion: apiVersion,
      metadata: {
        namespace: namespace,
        name: name
      }
    }

    const response = this.k8sClient.readResource(spec)

    this.resourceCache[cacheKey] = response

    return response
  }

  private createCacheKey(namespace: string, kind: string, name: string): string {
    return `${namespace}:${kind}:${name}`
  }
}

class Event {

  private readonly coreEventObject: k8s.CoreV1Event

  constructor(coreEventObject: k8s.CoreV1Event) {
    this.coreEventObject = coreEventObject
  }

  public get type(): string {
    return this.convertType(this.coreEventObject.type)
  }

  public get title(): string {
    return this.coreEventObject.reason || ''
  }

  public get timestamp(): Date {
    if (this.coreEventObject.metadata?.creationTimestamp) {
      return new Date(this.coreEventObject.metadata?.creationTimestamp)
    }

    return this.fallBackTimestamp()
  }

  public get details(): string {
    return JSON.stringify({
      message: this.coreEventObject.message,
      object: `${this.coreEventObject.involvedObject.kind}/${this.coreEventObject.involvedObject.name}`
    })
  }

  private convertType(eventType?: string): string {
    switch (eventType) {
      case 'Warning': return 'WARN'
      default: return 'INFO'
    }
  }

  private fallBackTimestamp(): Date {
    if (this.coreEventObject.firstTimestamp) return new Date(this.coreEventObject.firstTimestamp)
    if (this.coreEventObject.lastTimestamp) return new Date(this.coreEventObject.lastTimestamp)
    if (this.coreEventObject.eventTime) return new Date(this.coreEventObject.eventTime)
    return moment.utc().toDate()
  }

  public isAfter(timestamp: Date): boolean {
    return this.timestamp >= timestamp
  }
}