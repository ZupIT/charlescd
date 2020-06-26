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
import { render, wait, fireEvent } from 'unit-test/testUtils';
import VariationCard from '..'; 
import { CircleHealthType } from '../../interfaces';

const data = {
  circleComponents: [
    { name: 'api', status: 'STABLE', threshold: 100, value: 50 }
  ],
  unit: 'ms'
} as CircleHealthType;

test('render Circle Health Card collapse', async () => {
  const { getByTestId } = render(
    <VariationCard id={'test'} type={'test'} health={data} name={'test'}/>
  );

  await wait();

  expect(getByTestId('health-variation-card-test')).toBeInTheDocument();
});

test('render Circle Health Card expeand', async () => {
  const { getByTestId, getByText } = render(
    <VariationCard id={'test'} type={'test'} health={data} name={'test'}/>
  );

  await wait();

  const CardExpand = getByTestId('icon-expand');
  fireEvent.click(CardExpand);
  expect(getByText('api')).toBeInTheDocument();
});

test('render Circle Health Card collapse event', async () => {
  const { getByTestId } = render(
    <VariationCard id={'test'} type={'test'} health={data} name={'test'}/>
  );

  await wait();

  const CardExpand = getByTestId('icon-expand');
  fireEvent.click(CardExpand);
  const CardCollapse = getByTestId('icon-collapse');
  expect(CardCollapse).toBeInTheDocument();
  fireEvent.click(CardCollapse);
  expect(CardCollapse).not.toBeInTheDocument();
});