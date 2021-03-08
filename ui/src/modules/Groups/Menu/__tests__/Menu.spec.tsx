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
import { render, screen } from 'unit-test/testUtils';
import * as StateHooks from 'core/state/hooks';
import Menu from '../index';

test('render Menu user groups default', async () => {
  render(
    <Menu 
      onCreate={jest.fn()}
      onSelect={jest.fn()}
    />
  );

  const menu = await screen.findByTestId('user-groups-action');
  const emptyItems = await screen.findByText('No User group was found');

  expect(menu).toBeInTheDocument();
  expect(emptyItems).toBeInTheDocument();
});

test('render Menu user groups items', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    list: {
      content: [{
        id: '1',
        name: 'group',
        page: 0,
        size: 1,
        totalPages: 1,
        last: true,
        users: [{
          id: '2',
          name: 'Charles',
          email: 'charlescd@zup.com.br',
          createdAt: '2021-01-01 01:01'
        }]
      }]
    },
  }));

  render(
    <Menu 
      onCreate={jest.fn()}
      onSelect={jest.fn()}
    />
  );

  const menuItem = await screen.findByTestId('group-menu-item-1');
  expect(menuItem).toBeInTheDocument();
});
