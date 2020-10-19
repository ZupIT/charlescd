/* eslint-disable @typescript-eslint/camelcase */
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

const configKey = 'config';

export const getConfig = () => {
  try {
    return JSON.parse(atob(localStorage.getItem(configKey)));
  } catch (e) {
    return {};
  }
};

export const getConfigByKey = (key: string) => {
  const config = getConfig();
  return config?.[key];
};

export const setConfig = (key: string, value: unknown) => {
  const config = getConfig() || {};
  localStorage.setItem(
    configKey,
    btoa(
      JSON.stringify({
        ...config,
        [key]: value
      })
    )
  );
};
