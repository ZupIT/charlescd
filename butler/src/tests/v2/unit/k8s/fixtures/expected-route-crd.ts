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

import { CharlesRoutes } from '../../../../../app/v2/core/integrations/k8s/interfaces/charles-routes.interface'

export const expectedRouteCrd: CharlesRoutes = {
  apiVersion: 'charlescd.io/v1',
  kind: 'CharlesRoutes',
  metadata: {
    name: 'cd-configuration-id'
  },
  spec: {
    components: [
      {
        name: 'A',
        circles: [
          {
            id: 'circle-id-1',
            tag: 'v2',
            default: false
          },
          {
            id: 'circle-id-2',
            tag: 'v3',
            default: true
          }
        ]
      },
      {
        name: 'B',
        circles: [
          {
            id: 'circle-id-1',
            tag: 'v2',
            default: false
          },
          {
            id: 'circle-id-2',
            tag: 'v3',
            default: true
          }
        ]
      },
      {
        name: 'C',
        circles: [
          {
            id: 'circle-id-3',
            tag: 'v4',
            default: false
          }
        ]
      }
    ]
  }
}