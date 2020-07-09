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

import React from 'react';
import { render, wait } from 'unit-test/testUtils';
import CircleHealthComponent from '..';
import { CircleHealth } from '../interfaces';

const data = {
  errors: {
    circleComponents: [
      { name: 'api', status: 'STABLE', threshold: 100, value: 50 }
    ],
    unit: 'ms'
  },
  latency: {
    circleComponents: [
      { name: 'api', status: 'STABLE', threshold: 100, value: 50 }
    ],
    unit: 'ms'
  },
  requests: {
    unit: 'ms',
    value: '50'
  }
} as CircleHealth;

test('render Circle Health Component with default data', async () => {
  const { getByTestId } = render(
    <CircleHealthComponent id={'1'} name={'test'} circleHealthData={data} />
  );

  await wait();

  expect(getByTestId('health-variation')).toBeInTheDocument();
  expect(getByTestId('health-variation-card-Latency')).toBeInTheDocument();
  expect(getByTestId('health-variation-card-Error')).toBeInTheDocument();
});