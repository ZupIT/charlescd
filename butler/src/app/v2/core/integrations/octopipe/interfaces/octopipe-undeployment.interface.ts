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

import { K8sManifest } from '../../interfaces/k8s-manifest.interface'
import {
  IEKSClusterConfig,
  IGenericClusterConfig
} from '../../../../../v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'

export interface HelmRepositoryConfig {
  type: string
  url: string
  token: string
}

export interface HelmOverrideValues {
  'image.tag': string
  deploymentName: string
  component: string
  tag: string
  circleId: string
}

export interface HelmConfig {
  overrideValues: HelmOverrideValues
}

export interface Undeployment {
  componentName: string
  helmRepositoryConfig: HelmRepositoryConfig
  helmConfig: HelmConfig
  rollbackIfFailed: boolean
}

export interface OctopipeUndeployment {
  namespace: string;
  undeployments: Undeployment[]
  proxyDeployments: K8sManifest[]
  callbackUrl: string
  clusterConfig?: IEKSClusterConfig | IGenericClusterConfig | null
}
