/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import { LogEntity } from '../../api/deployments/entity/logs.entity'
import { ConsoleLoggerService } from '../../core/logs/console'
import { Log } from '../../api/deployments/interfaces/log.interface'
import { K8sClient } from '../../core/integrations/k8s/client'
import { LogRepository } from '../../api/deployments/repository/log.repository'
import * as LRUCache from 'lru-cache'
import { AppConstants } from '../../core/constants'
import { DeploymentRepositoryV2 } from '../../api/deployments/repository/deployment.repository'
import { ResourceWrapper } from './resource-wrapper'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
@Injectable()
export class EventsLogsAggregator {

  private static readonly KUBE_SYSTEM_NS_PREFIX = 'kube-'

  private readonly MAX_CACHE_SIZE = 100
  private readonly MAX_CACHE_AGE_ONE_HOUR = 1000 * 60 * 60

  private readonly cache: LRUCache<string, ResourceWrapper>


  constructor(private k8sClient: K8sClient,
    private logsRepository: LogRepository,
    private consoleLoggerService: ConsoleLoggerService,
    private deploymentsRepository: DeploymentRepositoryV2) {
    this.cache = new LRUCache({
      max: this.MAX_CACHE_SIZE,
      maxAge: this.MAX_CACHE_AGE_ONE_HOUR
    })
  }

  public async aggregate(coreEvent: k8s.CoreV1Event, since?: Date): Promise<void> {

    const involvedObject = coreEvent.involvedObject
    const event = this.validateAndCreateEvent(coreEvent, since)
    if (!event) {
      return
    }

    const resource = await this.cachedResourceFor(
        involvedObject.kind!,
        involvedObject.apiVersion!,
        involvedObject.name!,
        involvedObject.namespace
    )

    if (!resource) {
      this.consoleLoggerService.log(`Could not find resource ${involvedObject.kind}/${involvedObject.name} in namespace ${involvedObject.namespace}`)
      return
    }

    const deploymentId = resource.deploymentId

    if (!deploymentId) {
      this.consoleLoggerService.log(`Resource ${involvedObject.kind}/${involvedObject.name} in namespace ${involvedObject.namespace} does not has label ${AppConstants.DEPLOYMENT_ID_LABEL}. Discarding event...`)
      await this.checkResourceAnnotation(resource, event)
      return
    }

    const log = this.createLogFromEvent(event)

    if (await this.alreadyLogged(log, deploymentId)) {
      this.consoleLoggerService.log('Log Already saved... discarding event', log)
      return
    }
    this.consoleLoggerService.log(`Saving log for deployment "${deploymentId}"`)
    this.saveLogs(deploymentId, log)
  }

  private async checkResourceAnnotation(resource: ResourceWrapper, event: Event) {
    const circles = resource.circles
    const circlesIds = circles?.map(it => it.id)
    if (circlesIds?.length){
      const currentDeployments = await this.deploymentsRepository
        .findCurrentsByCirclesIds(circlesIds)
      const currentDeploymentsIds = currentDeployments
        .map(it => it.id)
      const log = this.createLogFromEvent(event)
      return await this.logsRepository.saveDeploymentsLogs(currentDeploymentsIds, log)
    }
  }


  private createLogFromEvent(event: Event) {
    return {
      type: event.type,
      title: event.title,
      timestamp: moment(event.timestamp).format(),
      details: event.details
    }
  }

  private async saveLogs(deploymentId: string, log: Log): Promise<LogEntity> {
    try {
      const logEntity = new LogEntity(deploymentId, [log])
      return await this.logsRepository.save(logEntity)
    } catch (error) {
      this.consoleLoggerService.error('Error while trying to save log', error)
      throw error
    }
  }

  private isEventOlderThan(event: Event, since?: Date): boolean {
    if (!since) {
      return false
    }
    return !event.isAfter(since)
  }

  private async cachedResourceFor(kind: string, apiVersion: string, name: string, namespace?: string,): Promise<ResourceWrapper | undefined>{
    
    const cacheKey = this.createCacheKey(kind, name, namespace)

    const cachedResponse = this.cache.get(cacheKey)
    if (cachedResponse) {
      return cachedResponse
    }

    const spec = {
      kind: kind,
      apiVersion: apiVersion,
      metadata: {
        namespace: namespace,
        name: name
      }
    }

    try {
      const response = await this.k8sClient.readResource(spec)
      const resource = new ResourceWrapper(response.body)
      this.cache.set(cacheKey, resource)
      return resource
    } catch (exception) {
      this.consoleLoggerService.error(`Error while trying to get resource event ${apiVersion}/${namespace}/${kind}/${name}`, exception.body)
      return undefined
    }
  }


  private createCacheKey(kind: string, name: string, namespace?: string): string {
    return  namespace ? `${namespace}:${kind}:${name}` : `${kind}:${name}`
  }


  private async alreadyLogged(logRequest: Log, deploymentId: string): Promise<Log | undefined> {
    const logEntity= await this.logsRepository.findDeploymentLogs(deploymentId)
    return logEntity?.logs.find(
      logDatabase => this.isSameLog(logRequest, logDatabase)
    )
  }

  private isSameLog(logRequest: Log, logDatabase: Log) {
    return logRequest.title === logDatabase.title
        &&  logRequest.timestamp === logDatabase.timestamp
        && logRequest.details === logDatabase.details
  }

  private validateAndCreateEvent(coreEvent: k8s.CoreV1Event, since?: Date) {
    const involvedObject = coreEvent.involvedObject
    if (!involvedObject.kind
        || !involvedObject.apiVersion
        || !involvedObject.name) {
      this.consoleLoggerService.log('"event.involvedObject" does not has the necessary data to identify the target resource! Discarding event...', involvedObject)
      return
    }

    if (involvedObject.namespace && involvedObject.namespace.startsWith(EventsLogsAggregator.KUBE_SYSTEM_NS_PREFIX)) {
      this.consoleLoggerService.log(`${involvedObject.namespace} is a kubernetes system namespace. Discarding event...`, involvedObject)
      return
    }
    const event = new Event(coreEvent)
    if (this.isEventOlderThan(event, since)) {
      this.consoleLoggerService.log(`Event created at ${event.timestamp} is older than ${since}. Discarding event...`)
      return
    }
    return event
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
