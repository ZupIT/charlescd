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

import { HelmTypes } from './constants'
import { createPrimaryId } from './create-id-names'
import { IBuildArtifact } from '../../interfaces'

const buildExpectedArtifacts = (helmRepository: string, githubAccount: string,
  appName: string, helmType: HelmTypes): IBuildArtifact => {
  const fileJudge = helmType === 'template'
    ? `${helmRepository}${appName}/${appName}-darwin.tgz`
    : `${helmRepository}${appName}/${appName}.yaml`
  return {
    defaultArtifact: {
      artifactAccount: githubAccount,
      id: `${helmType}-${appName}-default-artifact`,
      name: `${helmType}-${appName}`,
      reference: fileJudge,
      type: 'github/file',
      version: 'master'
    },
    displayName: helmType,
    id: createPrimaryId(helmType, appName),
    matchArtifact: {
      artifactAccount: 'github-artifact',
      id: `useless-${helmType}`,
      name: `${helmType}-${appName}`,
      type: 'github/file'
    },
    useDefaultArtifact: true,
    usePriorArtifact: false
  }
}

export default buildExpectedArtifacts
