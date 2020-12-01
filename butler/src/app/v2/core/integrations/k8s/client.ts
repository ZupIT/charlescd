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

  public async createDeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO return type?
    this.consoleLoggerService.log('START:CREATE_DEPLOYMENT_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment)
    this.consoleLoggerService.log('GET:CHARLES_DEPLOYMENT_MANIFEST', { deploymentManifest })
    try {
      this.consoleLoggerService.log('DO:READING_CRD_RESOURCE')
      await this.client.read(deploymentManifest)
      this.consoleLoggerService.log('DO:PATCHING_CRD_RESOURCE')
      const res = await this.client.patch(deploymentManifest)
      console.log('GET:PATCH_RESOURCE_RESPONSE', { response: JSON.stringify(res) })
    } catch(error) {
      this.consoleLoggerService.log('DO:CREATING_CRD_RESOURCE')
      const res = await this.client.create(deploymentManifest)
      console.log('GET:CREATE_RESOURCE_RESPONSE', { response: JSON.stringify(res) })
    }
  }

  public async createUndeploymentCustomResource(deployment: Deployment): Promise<void> { // TODO delete CRD?
    this.consoleLoggerService.log('START:UNDEPLOY_CUSTOM_RESOURCE', { deploymentId: deployment.id })
    const deploymentManifest = CrdBuilder.buildDeploymentCrdManifest(deployment)

    try {
      this.consoleLoggerService.log('DO:READING_CRD_RESOURCE')
      await this.client.read(deploymentManifest)
      this.consoleLoggerService.log('DO:DELETING_CRD_RESOURCE')
      await this.client.delete(deploymentManifest)
    } catch(error) {
      this.consoleLoggerService.log('ERROR:COULD_NOT_FIND_RESOURCE', { deploymentManifest })
    }
  }
}
