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

import { Inject, Injectable } from '@nestjs/common'
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

  public client: k8s.KubernetesObjectApi

  constructor(
    private consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {
    const kc = new k8s.KubeConfig()
    kc.loadFromCluster()
    this.client = k8s.KubernetesObjectApi.makeApiClient(kc)
  }

  public async applyDeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:CREATE_DEPLOYMENT_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment, this.envConfiguration.butlerNamespace)
    this.consoleLoggerService.log('GET:CHARLES_DEPLOYMENT_MANIFEST', { deploymentManifest })

    Object.assign(deploymentManifest.metadata, { labels: { deployment_id: deployment.id } })

    try {
      await this.readResource(deploymentManifest)
      await this.patchResource(deploymentManifest)
    } catch(error) {
      if (!(error instanceof k8s.HttpError) || error.statusCode !== 404) {
        this.consoleLoggerService.log('ERROR:CREATE_DEPLOYMENT_CUSTOM_RESOURCE', { error })
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
      this.consoleLoggerService.log('ERROR:COULD_NOT_FIND_RESOURCE', { deploymentManifest })
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
      this.consoleLoggerService.log('ERROR:COULD_NOT_FIND_RESOURCE', { routingManifest })
      throw error
    }
  }

  private async patchResource(manifest: KubernetesManifest): Promise<{ body: KubernetesObject; response: IncomingMessage; }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:PATCH_RESOURCE_MANIFEST')
      const res = await this.client.patch(
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
      this.consoleLoggerService.log('ERROR:PATCH_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  private async createResource(manifest: KubernetesManifest): Promise<{ body: KubernetesObject; response: IncomingMessage; }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:CREATE_RESOURCE_MANIFEST')
      const res = await this.client.create(manifest)
      this.consoleLoggerService.log('GET:CREATE_RESOURCE_RESPONSE')
      return res
    } catch(error) {
      this.consoleLoggerService.log('ERROR:CREATE_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  private async readResource(manifest: KubernetesManifest): Promise<void> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:READ_RESOURCE_MANIFEST')
      await this.client.read(manifest)
    } catch(error) {
      this.consoleLoggerService.log('ERROR:READ_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  private async deleteResource(manifest: KubernetesManifest): Promise<{ body: KubernetesObject; response: IncomingMessage; }> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:DELETE_RESOURCE_MANIFEST')
      const res = await this.client.delete(manifest)
      this.consoleLoggerService.log('GET:DELETE_RESOURCE_RESPONSE')
      return res
    } catch(error) {
      this.consoleLoggerService.log('ERROR:DELETE_RESOURCE_MANIFEST', { error })
      throw error
    }
  }
}
