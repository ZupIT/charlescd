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

export interface ICreateProduceArtifact {
  defaultArtifact: {
    customKind: boolean
    id: string
  }
  displayName: string
  id: string
  matchArtifact: {
    id: string
    name: string
    type: 'embedded/base64'
  }
  useDefaultArtifact: boolean
  usePriorArtifact: boolean
}

const createProduceArtifact = (version: string, appName: string): ICreateProduceArtifact => ({
  defaultArtifact: {
    customKind: true,
    id: `useless - deployment - ${version}`
  },
  displayName: `deployment - ${version}`,
  id: `deployment - ${version}`,
  matchArtifact: {
    id: `useless - deployment - ${version} - match`,
    name: appName,
    type: 'embedded/base64'
  },
  useDefaultArtifact: false,
  usePriorArtifact: false
})

export default createProduceArtifact
