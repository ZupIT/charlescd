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
import createProduceArtifact, { ICreateProduceArtifact } from './helpers/build-expected-artifact-produce'
import helmTypes, { HelmTypes } from './helpers/constants'
import { createBakeStage, createPrimaryId } from './helpers/create-id-names'

interface IInputArtifact {
  account: string
  id: string
}

const buildInputArtifact = (githubAccount: string, idArtifact: string): IInputArtifact => {
  return {
    account: githubAccount,
    id: idArtifact
  }
}

interface IAppConfig {
  appNamespace: string
  appName: string
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

const baseStageHelm = ({ appNamespace, appName }: IAppConfig,
  githubAccount: string,
  version: string, versionUrl: string, refId: string,
  reqRefId: string[], previousStage: string | undefined | string[], circleId: string): IBaseHelmStage => {
  const baseHelm: IBaseHelmStage = {
    stageEnabled: {},
    completeOtherBranchesThenFail: false,
    continuePipeline: true,
    failPipeline: false,
    expectedArtifacts: [createProduceArtifact(version, appName)],
    inputArtifacts: helmTypes.map(helmType => buildInputArtifact(githubAccount, createPrimaryId(helmType as HelmTypes, appName))),
    name: createBakeStage(version),
    namespace: appNamespace,
    outputName: `${appName}-${version}`,
    overrides: {
      'image.tag': versionUrl,
      'name': version,
      'circleId': circleId,
    },
    templateRenderer: 'HELM2',
    type: 'bakeManifest',

    refId,
    requisiteStageRefIds: reqRefId
  }
  if (previousStage) {
    baseHelm.stageEnabled = {
      expression: '${ #stage(\'' + previousStage + '\').status.toString() == \'SUCCEEDED\'}',
      type: 'expression'
    }
  }
  return baseHelm
}
export default baseStageHelm
