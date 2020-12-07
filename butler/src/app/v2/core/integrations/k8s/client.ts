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

import { Injectable } from '@nestjs/common'
import { Deployment } from '../../../api/deployments/interfaces'
import * as k8s from '@kubernetes/client-node'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { CrdBuilder } from './crd-builder'

@Injectable()
export class K8sClient {

  private client: k8s.KubernetesObjectApi

  constructor(
    private consoleLoggerService: ConsoleLoggerService
  ) {
    const kc = new k8s.KubeConfig()
    kc.loadFromCluster()
    this.client = k8s.KubernetesObjectApi.makeApiClient(kc)
  }

  public async applyDeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:CREATE_DEPLOYMENT_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment)
    this.consoleLoggerService.log('GET:CHARLES_DEPLOYMENT_MANIFEST', { deploymentManifest })
    try {
      await this.readResource(deploymentManifest)
      await this.patchResource(deploymentManifest)
    } catch(error) {
      await this.createResource(deploymentManifest) // TODO create condition? If 404 create?
    }
    this.consoleLoggerService.log('FINISH:CREATE_DEPLOYMENT_CUSTOM_RESOURCE')
  }

  public async applyUndeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:UNDEPLOY_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment)

    try {
      await this.readResource(deploymentManifest)
      await this.deleteResource(deploymentManifest)
    } catch(error) {
      this.consoleLoggerService.log('ERROR:COULD_NOT_FIND_RESOURCE', { deploymentManifest })
      throw error
    }
  }

  private async patchResource(manifest: k8s.KubernetesObject): Promise<void> { // TODO return type and use butler type
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
      console.log('GET:PATCH_RESOURCE_RESPONSE', { response: JSON.stringify(res) })
    } catch(error) {
      this.consoleLoggerService.log('ERROR:PATCH_RESOURCE_MANIFEST', { error })
    }
  }

  private async createResource(manifest: k8s.KubernetesObject): Promise<void> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:CREATE_RESOURCE_MANIFEST')
      const res = await this.client.create(manifest)
      console.log('GET:CREATE_RESOURCE_RESPONSE', { response: JSON.stringify(res) })
    } catch(error) {
      this.consoleLoggerService.log('ERROR:CREATE_RESOURCE_MANIFEST', { error })
    }
  }

  private async readResource(manifest: k8s.KubernetesObject): Promise<void> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:READ_RESOURCE_MANIFEST')
      await this.client.read(manifest)
    } catch(error) {
      this.consoleLoggerService.log('ERROR:READ_RESOURCE_MANIFEST', { error })
      throw error
    }
  }

  private async deleteResource(manifest: k8s.KubernetesObject): Promise<void> { // TODO return type and use butler type
    try {
      this.consoleLoggerService.log('START:DELETE_RESOURCE_MANIFEST')
      const res = await this.client.delete(manifest)
      console.log('GET:DELETE_RESOURCE_RESPONSE', { response: JSON.stringify(res) })
    } catch(error) {
      this.consoleLoggerService.log('ERROR:DELETE_RESOURCE_MANIFEST', { error })
    }
  }
}
