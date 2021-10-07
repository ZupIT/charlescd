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
// @ts-nocheck


import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
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
  const onSearch = jest.fn();
  const props = {
    children: 'button'
  };

  render(<Menu onSearch={onSearch} children={props.children} />);

  expect(screen.getByTestId('icon-plus-circle')).toBeInTheDocument();
  expect(screen.getByText('Create user')).toBeInTheDocument();
  expect(screen.getByTestId('input-text-search')).toBeInTheDocument();
});
