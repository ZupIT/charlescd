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

const expectedBaseVirtualService = {
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'VirtualService',
  metadata: {
    name: 'app-name',
    namespace: 'app-namespace'
  },
  spec: {
    hosts: [
      'app-name'
    ],
    http: [
      {
        match: [
          {
            headers: {
              cookie: {
                regex: '.*x-circle-id=header-value.*'
              }
            }
          }
        ],
        route: [
          {
            destination: {
              host: 'app-name',
              subset: 'v3'
            },
            headers: {
              response: {
                set: {
                  'x-circle-source': 'header-value',
                },
              },
              request: {
                set: {
                  'x-circle-source': 'header-value',
                },
              },
            },
          }
        ]
      },
      {
        match: [
          {
            headers: {
              'header-name': {
                exact: 'header-value'
              }
            }
          }
        ],
        route: [
          {
            destination: {
              host: 'app-name',
              subset: 'v3'
            },
            headers: {
              response: {
                set: {
                  'x-circle-source': 'header-value',
                },
              },
              request: {
                set: {
                  'x-circle-source': 'header-value',
                },
              },
            },
          }
        ]
      }
    ]
  }
}

export default expectedBaseVirtualService
