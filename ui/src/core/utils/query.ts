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

import forEach from 'lodash/forEach';

const getQueryStrings = () => new URLSearchParams(window.location.search);

export type URLParams = {
  [key: string]: boolean | string | number | string[] | number[];
};

export const buildParams = (data: URLParams) => {
  const params = new URLSearchParams();

  forEach(data, (value, key) => {
    if (Array.isArray(data[key])) {
      forEach(value as [], item => params.append(key, item));
    } else {
      params.append(key, value as string);
    }
  });

  return params;
};

export default getQueryStrings;
