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

import { CharlesDeployment } from '../../../../../app/v2/core/integrations/k8s/interfaces/charles-deployment.interface'

export const expectedDeploymentCrd: CharlesDeployment = {
  apiVersion: 'charlescd.io/v1',
  kind: 'CharlesDeployment',
  metadata: {
    name: 'circle-id',
    namespace: 'namespace'
  },
  spec: {
    deploymentId: 'deployment-id',
    circleId: 'circle-id',
    components: [
      {
        name: 'A',
        chart: 'http://localhost:2222/helm1',
        tag: 'v1'
      },
      {
        name: 'B',
        chart: 'http://localhost:2222/helm2',
        tag: 'v2'
      },
      {
        name: 'C',
        chart: 'http://localhost:2222/helm3',
        tag: 'v3'
      }
    ]
  }
}