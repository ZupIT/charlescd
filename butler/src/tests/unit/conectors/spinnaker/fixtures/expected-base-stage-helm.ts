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

const expectedBaseStageHelm = {
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  expectedArtifacts: [
    {
      defaultArtifact: {
        customKind: true,
        id: 'useless - deployment - version'
      },
      displayName: 'deployment - version',
      id: 'deployment - version',
      matchArtifact: {
        id: 'useless - deployment - version - match',
        name: 'app-name',
        type: 'embedded/base64'
      },
      useDefaultArtifact: false,
      usePriorArtifact: false
    }
  ],
  failPipeline: false,
  inputArtifacts: [
    {
      account: 'github-config',
      id: 'template - app-name'
    },
    {
      account: 'github-config',
      id: 'value - app-name'
    }
  ],
  name: 'Bake version',
  namespace: 'app-namespace',
  outputName: 'app-name-version',
  overrides: {
    'image.tag': 'version.url',
    'name': 'version'
  },
  refId: 'ref-if',
  requisiteStageRefIds: [
    'req-ref-id'
  ],
  stageEnabled: {},
  templateRenderer: 'HELM2',
  type: 'bakeManifest'
}

export default expectedBaseStageHelm
