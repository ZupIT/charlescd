import * as k8s from '@kubernetes/client-node'
import { Injectable } from '@nestjs/common'
import { getConnection } from 'typeorm'
import * as http from 'http'
import * as moment from 'moment'
import { LogEntity } from '../../api/deployments/entity/logs.entity'
import { ConsoleLoggerService } from '../../core/logs/console'
import { Log } from '../../api/deployments/interfaces/log.interface'

@Injectable()
export class EventsLogsAggregator {

  private readonly kubeConfig: k8s.KubeConfig
  private readonly resourceCache: Record<string, Promise<{
    body: k8s.KubernetesObject
    response: http.IncomingMessage
  }>> // TODO: configure a LRU cache here

  private lastConnectionLostTimestamp?: Date

  private connected = false

  constructor(private consoleLoggerService: ConsoleLoggerService) {
    this.kubeConfig = new k8s.KubeConfig()
    this.kubeConfig.loadFromDefault()
    this.resourceCache = {}
  }

  public async watchEvents(): Promise<void> {
    const k8sWatch = new k8s.Watch(this.kubeConfig)
    k8sWatch.watch('/api/v1/events',
      {},
      this.processEvent.bind(this),
      this.onFinishOrError.bind(this))
      .then(this.verifyConnectivity.bind(this))
      .catch(this.onError.bind(this))
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
    setTimeout(async() => this.watchEvents(), restartIn * 1000)
  }

  private async processEvent(phase: string, coreEvent: k8s.CoreV1Event) {
    try {
      this.consoleLoggerService.log(`Start processing new ${phase} event`)
      const involvedObject = coreEvent.involvedObject

      if (!involvedObject.namespace
        || !involvedObject.kind
        || !involvedObject.apiVersion
        || !involvedObject.name) {
        this.consoleLoggerService.log(`Unexpected behavior! "event.involvedObject" does not have mandatory data! Discarding ${phase} event`, involvedObject)
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
        && this.isAfter(event, this.lastConnectionLostTimestamp)) {

        const deploymentId = response.body.metadata?.labels?.['deploymentId']

        if (!deploymentId) {
          this.consoleLoggerService.log('Unexpected behavior! "deploymentId" is mandatory! Discarding event')
          return
        }

        const log = {
          type: event.type,
          title: event.title,
          timestamp: moment(event.timestamp).format(), // TODO: rever essa formatação
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
    return getConnection().transaction(async transactionManager => {
      const logEntity = new LogEntity(deploymentId, [log])
      return transactionManager.save(logEntity)
    })
  }

  private isAfter(event: Event, timestamp?: Date): boolean {
    return !timestamp || event.isAfter(timestamp)
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

    const k8sApi = k8s.KubernetesObjectApi.makeApiClient(this.kubeConfig)
    const spec = {
      kind: kind,
      apiVersion: apiVersion,
      metadata: {
        namespace: namespace,
        name: name
      }
    }

    const response = k8sApi.read(spec)

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
    if (this.coreEventObject.metadata.creationTimestamp) {
      return new Date(this.coreEventObject.metadata.creationTimestamp)
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