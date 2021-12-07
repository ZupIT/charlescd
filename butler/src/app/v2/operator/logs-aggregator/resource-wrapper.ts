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

import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import { AppConstants } from '../../core/constants'
import { plainToClass } from 'class-transformer'
import { K8sManifestWithSpec } from '../../core/integrations/interfaces/k8s-manifest.interface'
import { CharlesCircle } from '../../core/integrations/k8s/interfaces/charles-routes.interface'

export class ResourceWrapper {

    private resource: KubernetesObject
    private spec?: Record<string, unknown>

    constructor(resource: KubernetesObject) {
      this.resource = resource
      this.spec = plainToClass(K8sManifestWithSpec, this.resource).spec
    }
    
    public get circles(): CharlesCircle[] {
      return this.isCharlesRoutes() ? this.spec?.circles as CharlesCircle[] : []
    }

    private isCharlesRoutes() {
      return this.resource.kind === AppConstants.CHARLES_CUSTOM_RESOURCE_ROUTES_KIND
    }

    private isCharlesDeployment() {
      return this.resource.kind === AppConstants.CHARLES_CUSTOM_RESOURCE_DEPLOYMENT_KIND
    }

    public get deploymentId(): string | undefined {
      const deploymentId = this.resource.metadata?.labels?.[AppConstants.DEPLOYMENT_ID_LABEL]
      if (deploymentId) {
        return deploymentId
      }
      return this.isCharlesDeployment() ? this.spec?.deploymentId as string : undefined
    }
}