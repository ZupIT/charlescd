/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

import { KubernetesManifest } from '../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'
import { AppConstants } from '../../../app/v2/core/constants'

const basePath = path.join(__dirname, '../../../', 'resources/helm-test-chart')

export const defaultManifests: KubernetesManifest[] = yaml.safeLoadAll(fs.readFileSync(`${basePath}/manifest-default.yaml`, 'utf-8'))

export const defaultManifestsJson = yaml.safeLoadAll(fs.readFileSync(`${basePath}/manifest-default.yaml`, 'utf-8'), null, { json: true })

export const customManifests = (appName: string, namespace: string, image: string): KubernetesManifest[] => {
  const manifests = yaml.safeLoadAll(fs.readFileSync(`${basePath}/manifest-default.yaml`, 'utf-8'))
  const service = manifests[0]
  service.metadata.labels.app = appName
  service.metadata.labels.service = appName
  service.metadata.labels.component = appName
  service.metadata.name = appName
  service.metadata.namespace = namespace
  service.spec.selector.app = appName

  const deployment = manifests[1]
  deployment.metadata.labels.app = appName
  deployment.metadata.labels.version = appName
  deployment.metadata.labels.component = appName
  deployment.metadata.name = appName
  deployment.metadata.namespace = namespace
  deployment.spec.selector.matchLabels.app = appName
  deployment.spec.selector.matchLabels.version = appName
  deployment.spec.template.metadata.labels.app = appName
  deployment.spec.template.metadata.labels.version = appName
  deployment.spec.template.spec.containers[0].image = image
  deployment.spec.template.spec.containers[0].name = appName

  return [service, deployment]
}

export const routesManifests: KubernetesManifest[] = [
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'hello-kubernetes',
      namespace: 'namespace',
      annotations: {
        circles: '["b46fd548-0082-4021-ba80-a50703c44a3b"]'
      }
    },
    spec: {
      host: 'hello-kubernetes',
      subsets: [
        {
          labels: {
            component: 'hello-kubernetes',
            tag: 'build-image-tag',
            circleId: 'b46fd548-0082-4021-ba80-a50703c44a3b',
          },
          name: 'b46fd548-0082-4021-ba80-a50703c44a3b',
        },
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'hello-kubernetes',
      namespace: 'namespace',
      annotations: {
        circles: '["b46fd548-0082-4021-ba80-a50703c44a3b"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'hello-kubernetes',
      ],
      http: [
        {
          route: [
            {
              destination: {
                host: 'hello-kubernetes',
                subset: 'b46fd548-0082-4021-ba80-a50703c44a3b',
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'b46fd548-0082-4021-ba80-a50703c44a3b',
                  },
                },
                response: {
                  set: {
                    'x-circle-source': 'b46fd548-0082-4021-ba80-a50703c44a3b',
                  },
                },
              },
            },
          ],
        },
      ],
    },
  } as KubernetesManifest,
]
