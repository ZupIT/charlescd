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

type AppName = string
type AppNamespace = string
type AppPort = number

interface ISpinnakerMetadata {
  labels?: { app: AppName, service: AppName }
  name: AppName
  namespace: AppNamespace
}

interface ISpinnakerPort {
  name: 'http',
  port: AppPort,
  targetPort: AppPort
}

export interface ISpinnakerBaseService {
  apiVersion: string
  kind: string
  metadata: ISpinnakerMetadata
  spec: { host?: string, hosts?: string[], subsets?: ISubset[], ports?: ISpinnakerPort[], selector?: {app: AppName}}
}

export interface ISubset {
  labels: {
    version: string
  }
  name: string
}

const baseService = (appName: AppName, appNamespace: AppNamespace, appPort: AppPort): ISpinnakerBaseService => (
  {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      labels: {
        app: appName,
        service: appName
      },
      name: appName,
      namespace: appNamespace
    },
    spec: {
      ports: [
        {
          name: 'http',
          port: appPort,
          targetPort: appPort
        }
      ],
      selector: {
        app: appName
      }
    }
  })

export default baseService
