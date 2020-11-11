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
import MutationObserver from 'mutation-observer'
import { render, wait, screen } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import ModulesComparation  from '..';
import userEvent from '@testing-library/user-event';

(global as any).MutationObserver = MutationObserver

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: '/modules/compare',
    search: '?module=3f126d1b-c776-4c26-831d-b9ca148be910' 
  };
});

afterEach(() => {
  window = originalWindow;

});

test('render Modules comparation', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    name: 'workspace',
    components: [
      {
        id: '1',
        name: 'comp1',
        namespace: 'charlescd'
      },
      {
        id: '2',
        name: 'comp2',
        namespace: 'charlescd'
      },
      {
        id: '3',
        name: 'comp3',
        namespace: 'test'
      },
    ]
  }));
  render(<ModulesComparation />);
  const tabpanel = await screen.findByTestId('tabpanel-workspace');
  const charlescdComponents = await screen.findByText('charlescd');
  userEvent.click(charlescdComponents);
  const component1 = await screen.findByText('comp1');

  expect(component1).toBeInTheDocument();
  expect(tabpanel).toBeInTheDocument();
});