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

const expectedArtifactTemplate = {
  defaultArtifact: {
    artifactAccount: 'github-account',
    id: 'template-app-name-default-artifact',
    name: 'template-app-name',
    reference: 'https://api.github.com/repos/org/repo/contents/app-name/app-name-darwin.tgz',
    type: 'github/file',
    version: 'master'
  },
  displayName: 'template',
  id: 'template - app-name',
  matchArtifact: {
    artifactAccount: 'github-artifact',
    id: 'useless-template',
    name: 'template-app-name',
    type: 'github/file'
  },
  useDefaultArtifact: true,
  usePriorArtifact: false
}

export default expectedArtifactTemplate
