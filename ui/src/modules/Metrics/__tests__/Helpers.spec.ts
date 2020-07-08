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

import { normalizeCircleParams } from '../helpers';
import { Option } from 'core/components/Form/Select/interfaces';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';

test('Normalize Circle Params for request with specific data', async () => {
  const data = [{ label: 'Circle 1', value: '1' }, { label: 'Circle 2', value: '2' }, { label: 'Circle 3', value: '3' }] as Option[];
  const value = ['1', '2', '3'];

  expect(normalizeCircleParams(data)).toEqual(value);
})

test('Normalize Circle Params for request with all options', async () => {
 const data = [allOption, {label: 'circle 1',value: '1'}] as Option[];

  expect(normalizeCircleParams(data)).toEqual([]);
})
