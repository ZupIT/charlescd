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

import { Stage } from '../interfaces/spinnaker-pipeline.interface'
import { Component } from '../interfaces'

export const getBakeStage = (component: Component, stageId: number): Stage => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  expectedArtifacts: [
    {
      defaultArtifact: {
        customKind: true,
        id: `useless - deployment - ${component.imageTag}`
      },
      displayName: `deployment - ${component.imageTag}`,
      id: `deployment - ${component.imageTag}`,
      matchArtifact: {
        id: `useless - deployment - ${component.imageTag} - match`,
        name: `${component.name}-${component.imageTag}`,
        type: 'embedded/base64'
      },
      useDefaultArtifact: false,
      usePriorArtifact: false
    }
  ],
  failPipeline: false,
  inputArtifacts: [
    {
      account: 'github-artifact',
      id: `template - ${component.name}`
    },
    {
      account: 'github-artifact',
      id: `value - ${component.name}`
    }
  ],
  name: `Bake ${component.name} ${component.imageTag}`,
  namespace: 'sandbox',
  outputName: `${component.name}-${component.imageTag}`,
  overrides: {
    'image.tag': `${component.imageUrl}`,
    name: `${component.imageTag}`
  },
  refId: `${stageId}`,
  requisiteStageRefIds: [],
  stageEnabled: {
    type: 'expression'
  },
  templateRenderer: 'HELM2',
  type: 'bakeManifest'
})