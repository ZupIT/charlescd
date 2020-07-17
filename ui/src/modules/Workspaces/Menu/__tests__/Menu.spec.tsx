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
import { render } from 'unit-test/testUtils';
import Menu from '../index';

const mockItem = [
  {
    id: '1',
    name: 'workspace',
    users: {
      id: '21',
      name: 'User',
      email: 'user.test@zup.com.br',
      photoUrl: '',
      createdAt: '2020-05-07 20:24:46'
    }
  }
];

test('render Workspace Menu', () => {
  const { getByText } = render(
    <Menu
      items={mockItem}
      onSearch={jest.fn()}
      selectedWorkspace={jest.fn()}
      isLoading={false}
    />
  );

  const workspace = getByText('workspace');

  expect(workspace).toBeInTheDocument();
});

test('render Workspace Menu on loading', () => {
  const { getByText } = render(
    <Menu
      items={mockItem}
      onSearch={jest.fn()}
      selectedWorkspace={jest.fn()}
      isLoading
    />
  );

  const loading = getByText('Loading...');

  expect(loading).toBeInTheDocument();
});