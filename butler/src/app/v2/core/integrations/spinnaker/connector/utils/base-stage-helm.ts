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

import { IStageEnabled } from '../interfaces'
import { ICreateProduceArtifact } from './helpers/build-expected-artifact-produce'

interface IInputArtifact {
  account: string
  id: string
}

export interface IBaseHelmStage {
  stageEnabled: IStageEnabled | Record<string, unknown>
  completeOtherBranchesThenFail: false
  continuePipeline: true
  failPipeline: false
  expectedArtifacts: ICreateProduceArtifact[]
  inputArtifacts: IInputArtifact[]
  name: string
  namespace: string
  outputName: string
  overrides: {
    'image.tag': string
    name: string
    circleId: string
  }
  templateRenderer: 'HELM2'
  type: 'bakeManifest'
  refId: string
  requisiteStageRefIds: string[]
}
