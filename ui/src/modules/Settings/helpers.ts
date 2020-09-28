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

import find from 'lodash/find';
import filter from 'lodash/filter';
import isUndefined from 'lodash/isUndefined';
import { getConfigByKey, setConfig } from 'core/utils/config';
import { getProfileByKey } from 'core/utils/profile';

export const getWizardByUser = () => {
  const email = getProfileByKey('email');
  const wizard = getConfigByKey('wizard');

  return !isUndefined(find(wizard, (mail: string) => mail === btoa(email)));
};

export const setWizard = () => {
  const email = getProfileByKey('email');
  const wizard = getConfigByKey('wizard');
  setConfig('wizard', [...(wizard || []), btoa(email)]);
};

export const removeWizard = () => {
  const email = getProfileByKey('email');
  const wizard = getConfigByKey('wizard');
  const newWizard = filter(wizard, (mail: string) => mail !== btoa(email));
  setConfig('wizard', newWizard);
};
