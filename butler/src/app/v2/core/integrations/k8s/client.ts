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

import { InternalServerErrorException, Inject, Injectable } from '@nestjs/common'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import * as k8s from '@kubernetes/client-node'
import { CrdBuilder } from './crd-builder'
import { KubernetesManifest } from '../interfaces/k8s-manifest.interface'
import { ConsoleLoggerService } from '../../logs/console'
import { IoCTokensConstants } from '../../constants/ioc'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import { KubernetesObject } from '@kubernetes/client-node'
import { IncomingMessage } from 'http'

@Injectable()
export class K8sClient {

  private readonly kubeConfig: k8s.KubeConfig
  
  public objectApi: k8s.KubernetesObjectApi
  public coreV1Api: k8s.CoreV1Api

  constructor(
    private consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {
    this.kubeConfig = new k8s.KubeConfig()
    this.kubeConfig.loadFromCluster()
    this.objectApi = k8s.KubernetesObjectApi.makeApiClient(this.kubeConfig)
    this.coreV1Api = this.kubeConfig.makeApiClient(k8s.CoreV1Api)
  }

  public async applyDeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:CREATE_DEPLOYMENT_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, this.envConfiguration.butlerNamespace)
    this.consoleLoggerService.log('GET:CHARLES_DEPLOYMENT_MANIFEST', { deploymentManifest })

    Object.assign(deploymentManifest.metadata, { labels: { deployment_id: deployment.id } })

    try {
      await this.readResource(deploymentManifest)
      await this.patchResource(deploymentManifest)
    } catch (error) {
      if (!(error instanceof k8s.HttpError) || error.statusCode !== 404) {
        this.consoleLoggerService.error('ERROR:CREATE_DEPLOYMENT_CUSTOM_RESOURCE', { error })
        throw error
      }
      await this.createResource(deploymentManifest)
    }
    this.consoleLoggerService.log('FINISH:CREATE_DEPLOYMENT_CUSTOM_RESOURCE')
  }

  public async applyUndeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:UNDEPLOY_DEPLOYMENT_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, this.envConfiguration.butlerNamespace)

    try {
      await this.readResource(deploymentManifest)
      await this.deleteResource(deploymentManifest)
    } catch(error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_FIND_RESOURCE', { deploymentManifest })
      throw error
    }
  }

  public async applyRoutingCustomResource(activeComponents: Component[]): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:APPLY_ROUTING_CUSTOM_RESOURCE', { activeComponents })
    const routingManifest = CrdBuilder.buildRoutingCrdManifest(activeComponents, this.envConfiguration.butlerNamespace)

    try {
      await this.readResource(routingManifest)
      await this.patchResource(routingManifest)
    } catch(error) {
      this.consoleLoggerService.error('ERROR:COULD_NOT_FIND_RESOURCE', { routingManifest })
      throw error
    }
  }

  public async getNamespace(namespace: string): Promise<{ body: k8s.V1Namespace; response: IncomingMessage; }> {
    this.consoleLoggerService.log('START:SEARCH_FOR_NAMESPACE: ', namespace)
    
    try {
      return await this.coreV1Api.readNamespace(namespace)
    } catch (error) {
      if (error.response.body.code == 404){
        return {
          body: {},
          response: error.response
        }
      }
      this.consoleLoggerService.error('ERROR:SEARCH_FOR_NAMESPACE', error)
      throw new InternalServerErrorException({
        errors: [
          {
            message: `error while getting namespace '${namespace}'`, 
            detail: error.response.body.message,
            meta: {
              component: 'butler',
              timestamp: Date.now()
            },
            source: {
              pointer: 'namespace'
            },
            status: error.response.body.code
          }
        ]
      })
    }
  }

  private async patchResource(manifest: KubernetesManifest): Promise<{ body: KubernetesObject; response: IncomingMessage; }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:PATCH_RESOURCE_MANIFEST')
      const res = await this.objectApi.patch(
        manifest,
        undefined,
        undefined,
        undefined,
        undefined,
        { headers: { 'Content-type': 'application/merge-patch+json' } }
      )
      this.consoleLoggerService.log('GET:PATCH_RESOURCE_RESPONSE')
      return res
    } catch(error) {
      this.consoleLoggerService.error('ERROR:PATCH_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  private async createResource(manifest: KubernetesManifest): Promise<{ body: KubernetesObject; response: IncomingMessage; }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:CREATE_RESOURCE_MANIFEST')
      const res = await this.objectApi.create(manifest)
      this.consoleLoggerService.log('GET:CREATE_RESOURCE_RESPONSE')
      return res
    } catch(error) {
      this.consoleLoggerService.error('ERROR:CREATE_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  public async readResource(manifest: KubernetesManifest):
    Promise<{
      body: k8s.KubernetesObject,
      response: IncomingMessage
    }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:READ_RESOURCE_MANIFEST')
      return await this.objectApi.read(manifest)
    } catch(error) {

      this.consoleLoggerService.error('ERROR:READ_RESOURCE_MANIFEST', error )
      throw error
    }
  }

  private async deleteResource(manifest: KubernetesManifest): Promise<{ body: KubernetesObject; response: IncomingMessage; }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:DELETE_RESOURCE_MANIFEST')
      const res = await this.objectApi.delete(manifest)
      this.consoleLoggerService.log('GET:DELETE_RESOURCE_RESPONSE')
      return res
    } catch(error) {
      this.consoleLoggerService.error('ERROR:DELETE_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  // eslint-disable-next-line
  public async watchEvents(callback: (phase: string, coreEvent: k8s.CoreV1Event) => void, done: (err: any) => void): Promise<k8s.RequestResult> {
    const k8sWatch = new k8s.Watch(this.kubeConfig)
    return k8sWatch.watch('/api/v1/events', {}, callback, done)
  }
}
