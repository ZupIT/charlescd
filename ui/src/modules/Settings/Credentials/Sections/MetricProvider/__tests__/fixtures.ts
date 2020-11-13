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

import { Datasource, Plugin } from "../interfaces"

export const Datasources: Datasource[] = [
  {
    id: 'prometheus',
    name: 'Prometheus',
    pluginSrc: 'datasource/prometheus/prometheus',
    healthy: true,
    data: {},
  }
]


export const Plugins: Plugin[] = [
  {
    name: "Prometheus",
    id: "prometheus",
    description: "My prometheus",
    src: "datasource/prometheus/prometheus",
    inputParameters: {
      health: true,
      configurationInputs: [
        {
          name: "url",
          label: "Url",
          type: "text",
          required: true
        }
      ]
    }
  },
  {
    name: "Google Analytics",
    id: "googleanalytics",
    description: "My google analytics",
    src: "datasource/googleanalytics/googleanalytics",
    inputParameters: {
      configurationInputs: [
        {
          name: "viewId",
          label: "View ID",
          type: "text",
          required: true
        },
        {
          name: "serviceAccount",
          label: "Service Account",
          type: "textarea",
          required: true
        }
      ]
    }
  }
]
