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
import workspaces from '../../../../../stub/workspaces/mock';

const props = {
  items: workspaces.workspaces.content,
  onSearch: jest.fn()
};

test('renders Workspace menu', async () => {
  const { getByTestId, getAllByText } = render(
    <Menu
      items={props.items}
      onSearch={props.onSearch}
      selectedWorkspace={jest.fn()}
    />
  );
  const createButton = getByTestId('labeledIcon-plus-circle');
  const searchInput = getByTestId('input-text-search');
  const workspacesArray = getAllByText(/Workspace/);

  expect(createButton).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
  expect(workspacesArray.length).toBe(5);
});

test('renders Workspace menu on loading', () => {
  const { getByText } = render(
    <Menu
      items={props.items}
      onSearch={props.onSearch}
      selectedWorkspace={jest.fn()}
      isLoading
    />
  );
  expect(getByText('Loading...')).toBeInTheDocument();
});