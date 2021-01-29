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
import { render, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import userEvent from '@testing-library/user-event';
import Menu from '..';

const props = {
  isLoading: false,
  items: [
    {
      id: '123',
      name: 'name',
      email: 'charles@zup.com.br',
      applications: [{
        id: '456',
        name: '',
        menbersCount: 10
      }],
      createdAt: '01/01/2020 00:01'
    }
  ],
  onSearch: jest.fn()
}

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render Menu default', async () => {
  render(
    <Menu {...props} />
  );

  expect(screen.getByTestId('menu-users-charles@zup.com.br')).toBeInTheDocument();
});

test('render Menu default and do a empty search', async () => {
  render(
    <Menu isLoading={false} items={[]}  onSearch={jest.fn()} />
  );

  const inputSearch = screen.getByTestId('input-text-search');

  userEvent.type(inputSearch, 'unknown');
  
  await waitFor(() => expect(screen.getByTestId('empty-result-user')).toBeInTheDocument());
});
