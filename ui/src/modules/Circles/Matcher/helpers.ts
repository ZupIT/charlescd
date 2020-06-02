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

import reduce from 'lodash/reduce';
import { ParameterForm, ParameterPayload } from './interfaces';

export function buildParameters(params: ParameterForm[]) {
  return reduce<ParameterForm, ParameterPayload>(
    params,
    (acc, { key = '', value = '' }) => {
      acc[key] = value;

      return acc;
    },
    {}
  );
}

export function parseParameters(parameters: string) {
  try {
    const parsedParams = JSON.parse(parameters);

    return parsedParams;
  } catch {
    return parameters;
  }
}
