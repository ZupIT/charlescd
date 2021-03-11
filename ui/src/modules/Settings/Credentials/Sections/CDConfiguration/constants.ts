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

import { RadioButtonProps } from 'core/components/Radio/Buttons';

export const FORM_CD_CONFIGURATION = 'cd-configuration';

export const radios: RadioButtonProps[] = [
  { icon: 'charlescd', name: 'CharlesCD', value: 'OCTOPIPE' },
  { icon: 'spinnaker', name: 'Spinnaker', value: 'SPINNAKER' }
];

export const githubProvider = {
  value: 'GITHUB',
  label: 'GitHub',
  icon: 'github'
};

export const gitlabProvider = {
  value: 'GITLAB',
  label: 'GitLab',
  icon: 'gitlab'
};

export const gitProviders = [
  {
    ...githubProvider
  },
  {
    ...gitlabProvider
  }
];

export const providers: RadioButtonProps[] = [
  {
    name: 'Default',
    value: 'DEFAULT'
  },
  {
    name: 'EKS',
    value: 'EKS'
  },
  {
    name: 'Others',
    value: 'GENERIC'
  }
];
