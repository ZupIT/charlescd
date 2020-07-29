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

import { IDeploymentVersion, IPipelineCircle } from '../../../../../../../api/components/interfaces'
import { ISubset } from './base-service'

interface IDestinationRule {
  apiVersion: string
  kind: 'DestinationRule'
  metadata: {
    name: string
    namespace: string
  }
  spec: {
    host: string
    subsets: ISubset[]
  }
}

export interface IDestinationRuleParams {
  circles: IPipelineCircle[]
  appName: string
  appNamespace: string
  versions: IDeploymentVersion[]
}

const baseDestinationRules = (appName: string, appNamespace: string): IDestinationRule => ({
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'DestinationRule',
  metadata: {
    name: appName,
    namespace: appNamespace
  },
  spec: {
    host: appName,
    subsets: []
  }
})

const createSubsets = (versions: IDeploymentVersion[], appName: string): ISubset[] => {
  return versions.map(({ version }) => ({
    labels: {
      version: `${appName}-${version}`
    },
    name: version
  }))
}

const createDestinationRules = (appName: string, appNamespace: string, circles: IPipelineCircle[], versions: IDeploymentVersion[], hostValue: string | undefined) : IDestinationRule => {
  const newDestinationRule = baseDestinationRules(appName, appNamespace)
  if (circles) {
    const subsetsToAdd = createSubsets(versions, appName)
    newDestinationRule.spec.subsets = subsetsToAdd
  }

  if (hostValue) {
    newDestinationRule.spec.host = hostValue
  }

  return newDestinationRule
}

export default createDestinationRules
