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

import { ISpinnakerConfigurationData } from '../../../../../v1/api/configurations/interfaces'
import { ExpectedArtifact } from '../interfaces/spinnaker-pipeline.interface'
import { CdConfiguration, Component } from '../../../../api/deployments/interfaces'

export const getHelmTemplateObject = (component: Component, configuration: CdConfiguration): ExpectedArtifact => ({
  defaultArtifact: {
    artifactAccount: (configuration.configurationData as ISpinnakerConfigurationData).gitAccount,
    id: `template-${component.name}-default-artifact`,
    name: `template-${component.name}`,
    reference: `${component.helmUrl}/${component.name}/${component.name}-darwin.tgz`,
    type: 'github/file',
    version: 'master'
  },
  displayName: 'template',
  id: `template - ${component.name}`,
  matchArtifact: {
    artifactAccount: 'github-artifact',
    id: 'useless-template',
    name: `template-${component.name}`,
    type: 'github/file'
  },
  useDefaultArtifact: true,
  usePriorArtifact: false
})
