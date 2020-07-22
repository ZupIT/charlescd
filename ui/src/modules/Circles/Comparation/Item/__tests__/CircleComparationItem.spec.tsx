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
import MutationObserver from 'mutation-observer'
import CirclesComparationItem from '..';

(global as any).MutationObserver = MutationObserver

const props = {
  id: 'hypothesis-001'
}

test('render CirclesComparationItem default component', async () => {
  const handleChange = jest.fn();

  const { getByTestId } = render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  await wait();

  expect(getByTestId(`circles-comparation-item-${props.id}`)).toBeInTheDocument();
  expect(getByTestId(`tabpanel-Untitled`)).toBeInTheDocument();
});

